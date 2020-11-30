import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubtopicService} from '../../services/subtopic.service';
import {Topic} from '../../entities/topic';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';
import {concat, of, Subscription} from 'rxjs';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';
import {Subtopic} from '../../entities/subtopic';
import {AvailableSubtopicsService} from '../../services/available-subtopics.service';
import {ProblemService} from '../../services/problem.service';

@Component({
  selector: 'app-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.scss']
})
export class BeginnerComponent implements OnInit, OnDestroy {
  topics: Array<Topic>;
  subtopicId: number;
  availableSubtopics: Set<number>;
  acceptedSubtopics: Set<number>;
  acceptedProblemsBySubtopics: Map<number, number>;
  countProblemsBySubtopics: Map<number, number>;
  private acceptedProblemsBySubtopicsSubscription: Subscription;
  private availableSubtopicsSubscription: Subscription;

  constructor(private subtopicService: SubtopicService,
              private problemService: ProblemService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private availableTopicsService: AvailableSubtopicsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.acceptedSubtopics = new Set<number>();
    this.availableSubtopics = new Set<number>();
  }

  ngOnInit() {
    this.subtopicService.getTopics()
      .subscribe(topics => this.topics = topics);
    this.acceptedProblemsBySubtopicsSubscription = this.acceptedSubmissionService.getAcceptedBySubtopics()
      .subscribe(accepted => this.acceptedProblemsBySubtopics = accepted);
    this.problemService.countBySubtopic()
      .subscribe(number => this.countProblemsBySubtopics = number);
    this.availableSubtopicsSubscription = this.availableTopicsService.getAvailableSubtopics()
      .subscribe(availableTopics => this.availableSubtopics = availableTopics);

    concat(
      of(this.route.firstChild),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route.firstChild)
      )
    )
      .pipe(switchMap(route => route.paramMap))
      .subscribe(paramMap => {
        const subtopicId = +paramMap.get('subtopicId');
        if (subtopicId !== this.subtopicId) {
          this.subtopicId = subtopicId;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.acceptedProblemsBySubtopicsSubscription) {
      this.acceptedProblemsBySubtopicsSubscription.unsubscribe();
    }
    if (this.availableSubtopicsSubscription) {
      this.availableSubtopicsSubscription.unsubscribe();
    }
  }

  public getAcceptedProblem(id: number) {
    if (!this.acceptedProblemsBySubtopics) {
      return '';
    }
    const accepted = this.acceptedProblemsBySubtopics.get(id);
    return accepted ? accepted : 0;
  }

  public getTotalProblem(id: number) {
    if (!this.countProblemsBySubtopics) {
      return '';
    }
    const count = this.countProblemsBySubtopics.get(id);
    return count ? count : 0;
  }

  public getAcceptedInTopic(subtopics: Array<Subtopic>): boolean {
    for (const subtopic of subtopics) {
      if (this.getAcceptedProblem(subtopic.id) !== this.getTotalProblem(subtopic.id)) {
        return false;
      }
    }
    return true;
  }

  public getAcceptedInSubtopic(subtopic: Subtopic): boolean {
    return this.getAcceptedProblem(subtopic.id) === this.getTotalProblem(subtopic.id);
  }

  public hasAvailableSubtopics(subtopics: Array<Subtopic>) {
    for (const subtopic of subtopics) {
      if (this.availableSubtopics.has(subtopic.id)) {
        return true;
      }
    }
    return false;
  }

  public isOpened(topic: Topic) {
    for (const subtopic of topic.subtopics) {
      if (subtopic.id === this.subtopicId) {
        return true;
      }
    }
    return false;
  }
}
