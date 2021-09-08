import {Component, OnDestroy, OnInit} from '@angular/core';
import {PersonalPlanService} from '../../services/personal-plan.service';
import {ActivePlan} from '../../entities/active-plan';
import {FuturePlan} from '../../entities/future-plan';
import {Subscription, timer} from 'rxjs';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';

@Component({
  selector: 'app-personal-plan-progress',
  templateUrl: './personal-plan-progress.component.html',
  styleUrls: ['./personal-plan-progress.component.scss']
})
export class PersonalPlanProgressComponent implements OnInit, OnDestroy {
  seconds: number;
  startSeconds: number;
  secondsToSample: number;
  dayToSample: number;
  activePlan: ActivePlan;
  futurePlan: FuturePlan;
  problemsStatuses: Map<number, string>;
  private acceptedProblemsSubscription: Subscription;
  private personalPlanChangesSubscription: Subscription;
  private countdownTimerSubscription: Subscription;
  count = 0;
  planCompleted: boolean;
  days: { [k: string]: string } = {
    'one': ' день',
    'few': ' дня',
    'many': ' дней'
  };
  left: { [k: string]: string } = {
    'one': 'Остался ',
    'few': 'Осталось ',
    'many': 'Осталось '
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
        this.startSeconds = (new Date(activePlan.deadline).getTime() - new Date().getTime()) / 1000;
        this.day = Math.ceil((this.seconds) / (3600 * 24));
        this.startCountdownTimer();
      });
      this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
        this.futurePlan = futurePlan;
      });
    });
  }

  startCountdownTimer() {
    this.countdownTimerSubscription = timer(0, 1000)
      .subscribe((count) => {
        this.secondsToSample = this.startSeconds - count;
        this.dayToSample = Math.ceil((this.secondsToSample) / (this.secondsInDay));
        if (this.secondsToSample === 0) {
          setTimeout(() => {
            this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
              this.futurePlan = futurePlan;
            });
          }, 1000);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.acceptedProblemsSubscription) {
      this.acceptedProblemsSubscription.unsubscribe();
    }
    if (this.personalPlanChangesSubscription) {
      this.personalPlanChangesSubscription.unsubscribe();
    }
    if (this.countdownTimerSubscription) {
      this.countdownTimerSubscription.unsubscribe();
    }
  }

  countCompletedTasks(): number {
    this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
      this.futurePlan = futurePlan;
    });
    let cnt = 0;
    const countProblemsInPlan = this.activePlan.problems.map(x => x.problemId);
    for (const id of countProblemsInPlan) {
      if (this.problemsStatuses.get(id) === 'Accepted') {
        cnt++;
      }
    }
    this.planCompleted = countProblemsInPlan.length === cnt;
    return cnt * 100 / countProblemsInPlan.length;
  }

}
