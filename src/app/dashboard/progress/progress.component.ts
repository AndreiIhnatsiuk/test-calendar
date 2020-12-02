import {Component, OnDestroy, OnInit} from '@angular/core';
import {concat, of, Subscription} from 'rxjs';
import {SubtopicService} from '../../services/subtopic.service';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';
import {AvailableSubtopicsService} from '../../services/available-subtopics.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';
import * as routes from '../routes';
import {Problem} from '../../entities/problem';
import {ProblemService} from '../../services/problem.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
  problems: Array<Problem>;
  acceptedProblems: Map<number, boolean>;
  acceptedSubtopic: boolean;
  subtopicId: number;
  problemId: number;
  private acceptedProblemsSubscription: Subscription;
  urlToSubtopic: string;
  url = routes;

  constructor(private subtopicService: SubtopicService,
              private problemService: ProblemService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private availableTopicsService: AvailableSubtopicsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.acceptedProblems = new Map<number, boolean>();
    this.urlToSubtopic = routes.JAVA + '/' + routes.SUBTOPIC + '/';
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
        const subtopicId = +paramMap.get('subtopicId');
        const problemId = +paramMap.get('problemId');
        if (subtopicId !== this.subtopicId) {
          this.subtopicId = subtopicId;
          this.problemService.getProblemsBySubtopicId(this.subtopicId).subscribe(problems => {
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
          this.updateAcceptedSubtopic();
        });
    }
  }

  private updateAcceptedSubtopic() {
    for (const problem of this.problems) {
      if (!this.acceptedProblems.get(problem.id)) {
        this.acceptedSubtopic = false;
        return;
      }
    }
    this.acceptedSubtopic = true;
  }
}
