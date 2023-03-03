import {Component, OnDestroy, OnInit} from '@angular/core';
import {concat, of, Subscription} from 'rxjs';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';
import * as routes from '../routes';
import {Problem} from '../../entities/problem';
import {ProblemService} from '../../services/problem.service';
import {AvailableProblemsService} from '../../services/available-problem.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
  problems: Array<Problem>;
  problemsStatuses: Map<number, string>;
  availableProblemIds: Set<number>;
  acceptedLesson: boolean;
  topicId: number;
  problemId: number;
  moduleId: number;
  private acceptedProblemsSubscription: Subscription;
  private availableProblemsSubscription: Subscription;
  url = routes;
  show = true;

  constructor(private problemService: ProblemService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private availableProblemsService: AvailableProblemsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.problems = new Array<Problem>();
    this.problemsStatuses = new Map<number, string>();
    this.availableProblemIds = new Set<number>();
  }

  ngOnInit() {
    concat(
      of(this.updateFirsChild()),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.updateFirsChild())
      )
    )
      .pipe(switchMap(route => route.paramMap))
      .subscribe(paramMap => {
        this.moduleId = Number.parseFloat(this.route.firstChild.snapshot.paramMap.get('moduleId'));
        const topicId = +paramMap.get('topicId');
        const problemId = +paramMap.get('problemId');
        this.show = topicId !== 0;
        if (topicId !== this.topicId && topicId !== 0) {
          console.log(paramMap);
          this.topicId = topicId;
          this.problemService.getProblemsByTopicId(this.topicId).subscribe(problems => {
            this.problems = problems;
            this.updateAccepted();
          });
        } else if (problemId !== this.problemId) {
          this.updateAccepted();
        }
        this.problemId = problemId;
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

  private updateFirsChild() {
    if (this.route.firstChild !== null) {
      return this.route.firstChild.firstChild ? this.route.firstChild.firstChild : this.route.firstChild;
    }
    return this.route;
  }

  private updateAccepted() {
    if (this.acceptedProblemsSubscription) {
      this.acceptedProblemsSubscription.unsubscribe();
      this.acceptedProblemsSubscription = undefined;
    }
    if (this.problems) {
      this.acceptedProblemsSubscription = this.acceptedSubmissionService.getProblemsStatuses(this.problems.map(x => x.id))
        .subscribe(accepted => {
          this.problemsStatuses = accepted;
          this.updateAcceptedLesson();
        });
    }
    if (this.availableProblemsSubscription) {
      this.availableProblemsSubscription.unsubscribe();
      this.availableProblemsSubscription = undefined;
    }
    if (this.topicId) {
      this.availableProblemsSubscription = this.availableProblemsService.getAvailableProblemsByTopicId(this.topicId)
        .subscribe(problemIds => {
          this.availableProblemIds = problemIds;
        });
    }
  }

  private updateAcceptedLesson() {
    for (const problem of this.problems) {
      if (this.problemsStatuses.get(problem.id) !== 'Accepted') {
        this.acceptedLesson = false;
        return;
      }
    }
    this.acceptedLesson = true;
  }
}
