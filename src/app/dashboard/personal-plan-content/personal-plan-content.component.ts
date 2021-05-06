import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivePlan} from '../../entities/active-plan';
import {FuturePlan} from '../../entities/future-plan';
import {PlanProblem} from '../../entities/plan-problem';
import {Subscription} from 'rxjs';
import {PersonalPlanService} from '../../services/personal-plan.service';
import {AvailableProblemsService} from '../../services/available-problem.service';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';

@Component({
  selector: 'app-personal-plan-content',
  templateUrl: './personal-plan-content.component.html',
  styleUrls: ['./personal-plan-content.component.scss']
})
export class PersonalPlanContentComponent implements OnInit, OnDestroy {
  activePlan: ActivePlan;
  futurePlan: FuturePlan;
  problemsStatuses: Map<number, string>;
  planProblemByLessonId: Map<number, Array<PlanProblem>>;
  planProblems: Array<Array<PlanProblem>>;
  availableProblemIds: Set<number>;
  private acceptedProblemsSubscription: Subscription;
  private availableProblemsSubscription: Subscription;
  tasks: { [k: string]: string } = {
    'one': '# задачу',
    'few': '# задачи',
    'many': '# задач'
  };
  sending: boolean;
  isPlanCompleted: boolean;

  constructor(private personalPlanService: PersonalPlanService,
              private availableProblemsService: AvailableProblemsService,
              private acceptedSubmissionService: AcceptedSubmissionService) {
    this.problemsStatuses = new Map<number, string>();
    this.availableProblemIds = new Set<number>();
    this.planProblemByLessonId = new Map<number, Array<PlanProblem>>();
    this.planProblems = new Array<Array<PlanProblem>>();
  }

  ngOnInit(): void {
    this.personalPlanService.getActivePlan().subscribe(activePlan => {
      this.activePlan = activePlan;
      this.updateAccepted();
    });
    this.personalPlanService.getFuturePlan().subscribe(futurePlan => {
      this.futurePlan = futurePlan;
    });
  }

  ngOnDestroy(): void {
    if (this.acceptedProblemsSubscription) {
      this.acceptedProblemsSubscription.unsubscribe();
    }
    if (this.availableProblemsSubscription) {
      this.availableProblemsSubscription.unsubscribe();
    }
  }

  private updateAccepted() {
    for (const planProblem of this.activePlan.problems) {
      if (this.planProblemByLessonId.has(planProblem.lessonId)) {
        this.planProblemByLessonId.get(planProblem.lessonId).push(planProblem);
      } else {
        this.planProblemByLessonId.set(planProblem.lessonId, new Array<PlanProblem>(planProblem));
      }
    }
    this.planProblemByLessonId.forEach(value => this.planProblems.push(value));

    if (this.acceptedProblemsSubscription) {
      this.acceptedProblemsSubscription.unsubscribe();
      this.acceptedProblemsSubscription = undefined;
    }
    if (this.activePlan.problems) {
      this.acceptedProblemsSubscription = this.acceptedSubmissionService.getProblemsStatuses(this.activePlan.problems.map(x => x.problemId))
        .subscribe(accepted => {
          this.problemsStatuses = accepted;
          this.isPlanCompleted = this.updateIsPlanCompleted();
        });
    }
    if (this.availableProblemsSubscription) {
      this.availableProblemsSubscription.unsubscribe();
      this.availableProblemsSubscription = undefined;
    }
    if (this.activePlan.problems) {
      this.availableProblemsSubscription =
        this.availableProblemsService.getAvailableProblemsByProblemIdIn(this.activePlan.problems.map(x => x.problemId))
          .subscribe(problemIds => {
            this.availableProblemIds = problemIds;
          });
    }
  }

  send() {
    this.sending = true;
    this.personalPlanService.generatePlan().subscribe(() => {
      this.personalPlanService.getActivePlan().subscribe(activePlan => {
        this.activePlan = activePlan;
        this.updateAccepted();
      });
    });
  }

  updateIsPlanCompleted(): boolean {
    for (const problem of this.activePlan.problems) {
      if (this.problemsStatuses.get(problem.problemId) !== 'Accepted') {
        return false;
      }
    }
    return true;
  }
}

