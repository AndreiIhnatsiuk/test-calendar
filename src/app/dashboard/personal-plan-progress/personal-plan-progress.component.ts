import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CountdownComponent} from 'ngx-countdown';
import {PersonalPlanService} from '../../services/personal-plan.service';
import {ActivePlan} from '../../entities/active-plan';
import {FuturePlan} from '../../entities/future-plan';
import {Subscription} from 'rxjs';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';

@Component({
  selector: 'app-personal-plan-progress',
  templateUrl: './personal-plan-progress.component.html',
  styleUrls: ['./personal-plan-progress.component.scss']
})
export class PersonalPlanProgressComponent implements OnInit, OnDestroy {
  @ViewChild('cd', {static: false}) private countdown: CountdownComponent;
  time: number;
  activePlan: ActivePlan;
  futurePlan: FuturePlan;
  problemsStatuses: Map<number, string>;
  private acceptedProblemsSubscription: Subscription;
  private personalPlanChangesSubscription: Subscription;
  count = 0;
  active = true;

  constructor(private personalPlanService: PersonalPlanService,
              private acceptedSubmissionService: AcceptedSubmissionService) {
    this.problemsStatuses = new Map<number, string>();
  }

  ngOnInit(): void {
    this.personalPlanChangesSubscription = this.personalPlanService.getChanges().subscribe(() => {
      if (this.acceptedProblemsSubscription) {
        this.acceptedProblemsSubscription.unsubscribe();
      }
      this.personalPlanService.getActivePlan().subscribe(activePlan => {
        this.activePlan = activePlan;
        if (this.activePlan.problems) {
          this.acceptedProblemsSubscription =
            this.acceptedSubmissionService.getProblemsStatuses(this.activePlan.problems.map(x => x.problemId))
            .subscribe(accepted => {
              this.problemsStatuses = accepted;
              this.count = this.countCompletedTasks();
            });
        }
        this.time = (new Date(activePlan.deadline).getTime() - new Date().getTime()) / 1000;
        if (this.countdown) {
          this.countdown.begin();
        }
      });
      this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
        this.futurePlan = futurePlan;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.acceptedProblemsSubscription) {
      this.acceptedProblemsSubscription.unsubscribe();
    }
    if (this.personalPlanChangesSubscription) {
      this.personalPlanChangesSubscription.unsubscribe();
    }
  }

  countCompletedTasks(): number {
    this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
      this.futurePlan = futurePlan;
      if (futurePlan.status === 'AVAILABLE') {
        this.active = false;
      }
    });
    let cnt = 0;
    for (const id of this.activePlan.problems.map(x => x.problemId)) {
      if (this.problemsStatuses.get(id) === 'ACCEPTED') {
        cnt++;
      }
    }
    return cnt * 100 / this.activePlan.problems.map(x => x.problemId).length;
  }

  onEvent($event) {
    if ($event.action === 'done') {
      this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
        this.futurePlan = futurePlan;
        this.active = false;
      });
    }
  }
}
