import {Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  seconds: number;
  activePlan: ActivePlan;
  futurePlan: FuturePlan;
  problemsStatuses: Map<number, string>;
  private acceptedProblemsSubscription: Subscription;
  private personalPlanChangesSubscription: Subscription;
  count = 0;
  planCompleted: boolean;
  days: {[k: string]: string} = {
    'one': ' день',
    'few': ' дня',
    'many': ' дней'
  };
  day: number;
  secondsInDay = 86400;

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
        this.seconds = (new Date(activePlan.deadline).getTime() - new Date().getTime()) / 1000;
        this.day = Math.floor((this.seconds + 3600 * 12) / (3600 * 24));
        if (this.countdown) {
          this.countdown.begin();
        }
      });
      this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
        this.futurePlan = futurePlan;
        console.log(futurePlan);
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
    });
    let cnt = 0;
    const countProblemsInPlan = this.activePlan.problems.map(x => x.problemId);
    for (const id of countProblemsInPlan) {
      if (this.problemsStatuses.get(id) === 'ACCEPTED') {
        cnt++;
      }
    }
    this.planCompleted = countProblemsInPlan.length === cnt;
    return cnt * 100 / countProblemsInPlan.length;
  }

  onEvent($event) {
    if ($event.action === 'done') {
      setTimeout(() => {
        this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
          this.futurePlan = futurePlan;
        });
      }, 1000);
    }
  }
}
