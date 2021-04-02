import {Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CountdownComponent} from 'ngx-countdown';
import {PersonalPlanService} from '../../services/personal-plan';
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
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  time: number;
  activePlan: ActivePlan;
  futurePlan: FuturePlan;
  acceptedProblems: Map<number, boolean>;
  private acceptedProblemsSubscription: Subscription;
  count = 0;
  active = true;

  constructor(private personalPlanService: PersonalPlanService,
              private acceptedSubmissionService: AcceptedSubmissionService) {
    this.acceptedProblems = new Map<number, boolean>();
  }

  ngOnInit(): void {
    this.personalPlanService.getActivePlan().subscribe(activePlan => {
      this.activePlan = activePlan;
      if (this.activePlan.problems) {
        this.acceptedProblemsSubscription = this.acceptedSubmissionService.getAccepted(this.activePlan.problems.map(x => x.problemId))
          .subscribe(accepted => {
            this.acceptedProblems = accepted;
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
  }

  ngOnDestroy(): void {
    if (this.acceptedProblemsSubscription) {
      this.acceptedProblemsSubscription.unsubscribe();
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
      if (this.acceptedProblems.get(id)) {
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
