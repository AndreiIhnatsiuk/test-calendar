import {Component, OnDestroy, OnInit} from '@angular/core';
import {concat, of, Subscription} from 'rxjs';
import {LessonService} from '../../services/lesson.service';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';
import {AvailableLessonsService} from '../../services/available-lessons.service';
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
  acceptedProblems: Map<number, boolean>;
  availableProblemIds: Set<number>;
  acceptedLesson: boolean;
  lessonId: number;
  problemId: number;
  private acceptedProblemsSubscription: Subscription;
  private availableProblemsSubscription: Subscription;
  urlToLesson: string;
  url = routes;

  constructor(private problemService: ProblemService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private availableProblemsService: AvailableProblemsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.problems = new Array<Problem>();
    this.acceptedProblems = new Map<number, boolean>();
    this.availableProblemIds = new Set<number>();
    this.urlToLesson = routes.JAVA + '/' + routes.LESSON + '/';
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
        const lessonId = +paramMap.get('lessonId');
        const problemId = +paramMap.get('problemId');
        if (lessonId !== this.lessonId) {
          this.lessonId = lessonId;
          this.problemService.getProblemsByLessonId(this.lessonId).subscribe(problems => {
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
      this.acceptedProblemsSubscription = this.acceptedSubmissionService.getAccepted(this.problems.map(x => x.id))
        .subscribe(accepted => {
          this.acceptedProblems = accepted;
          this.updateAcceptedLesson();
        });
    }
    if (this.availableProblemsSubscription) {
      this.availableProblemsSubscription.unsubscribe();
      this.availableProblemsSubscription = undefined;
    }
    if (this.lessonId) {
      this.availableProblemsSubscription = this.availableProblemsService.getAvailableProblems(this.lessonId)
        .subscribe(problemIds => {
          this.availableProblemIds = problemIds;
        });
    }
  }

  private updateAcceptedLesson() {
    for (const problem of this.problems) {
      if (!this.acceptedProblems.get(problem.id)) {
        this.acceptedLesson = false;
        return;
      }
    }
    this.acceptedLesson = true;
  }

  getStatus(problem: Problem): string {
    if (this.acceptedProblems.has(problem.id) && this.acceptedProblems.get(problem.id)) {
      return 'green';
    }
    if (this.acceptedProblems.has(problem.id) && !this.acceptedProblems.get(problem.id)) {
      return 'red';
    }
    if (this.availableProblemIds.has(problem.id)) {
      return 'blue';
    }
    return;
  }
}
