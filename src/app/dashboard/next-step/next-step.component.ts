import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Topic} from '../../entities/topic';
import {AvailableSubtopicsService} from '../../services/available-subtopics.service';
import {SubtopicService} from '../../services/subtopic.service';
import * as routes from '../routes';
import {Subscription, zip} from 'rxjs';
import {Problem} from '../../entities/problem';
import {ProblemService} from '../../services/problem.service';

@Component({
  selector: 'app-next-step',
  templateUrl: './next-step.component.html',
  styleUrls: ['./next-step.component.scss']
})
export class NextStepComponent implements OnChanges, OnInit, OnDestroy {
  @Input() problemId: number;
  @Input() subtopicId: number;

  problems: Array<Problem>;
  oldSubtopicId: number;
  topics: Array<Topic>;
  availableSubtopics: Set<number>;
  urlToSubtopic: string;
  availableSubtopicsSubscription: Subscription;
  urlToNextStep: Array<any>;

  constructor(private route: ActivatedRoute,
              private problemService: ProblemService,
              private availableTopicsService: AvailableSubtopicsService,
              private subtopicService: SubtopicService) {
    this.topics = new Array<Topic>();
    this.availableSubtopics = new Set<number>();
    this.urlToSubtopic = '/' + routes.DASHBOARD + '/' + routes.JAVA + '/' + routes.SUBTOPIC;
  }

  ngOnInit() {
    zip(
      this.subtopicService.getTopics(),
      this.problemService.getProblemsBySubtopicId(this.subtopicId),
    ).subscribe(([topics, problems]) => {
      this.topics = topics;
      this.problems = problems;
      this.urlToNextStep = this.getNextStepLink();
    });
    this.availableSubtopicsSubscription = this.availableTopicsService.getAvailableSubtopics()
      .subscribe(availableTopics => {
        this.availableSubtopics = availableTopics;
        this.urlToNextStep = this.getNextStepLink();
      });
  }

  ngOnChanges() {
    if (this.oldSubtopicId !== this.subtopicId) {
      zip(
        this.problemService.getProblemsBySubtopicId(this.subtopicId),
      ).subscribe(([problems]) => {
        this.problems = problems;
        this.urlToNextStep = this.getNextStepLink();
      });
    }
  }

  ngOnDestroy() {
    if (this.availableSubtopicsSubscription) {
      this.availableSubtopicsSubscription.unsubscribe();
    }
  }

  getNextStepLink() {
    if (!this.problemId) {
      if (this.problems && this.problems.length > 0) {
        return [this.urlToSubtopic, this.subtopicId, routes.PROBLEM, this.problems[0].id];
      }
    } else {
      if (this.problemId && this.problems && this.problems[this.problems.length - 1].id !== this.problemId) {
        return this.getNextProblemLink();
      }
    }
    return this.getNextSubtopicLink();
  }

  getNextProblemLink() {
    let isCurrentTask = false;
    for (const problem of this.problems) {
      if (isCurrentTask) {
        return [this.urlToSubtopic, this.subtopicId, routes.PROBLEM, problem.id];
      }
      if (this.problemId === problem.id) {
        isCurrentTask = true;
      }
    }
  }

  getNextSubtopicLink() {
    const nextSubtopicId = this.getNextSubtopicId();
    if (this.availableSubtopics.has(nextSubtopicId)) {
      return [this.urlToSubtopic, nextSubtopicId];
    }
    return null;
  }

  getNextSubtopicId() {
    let isCurrentTopic = false;
    for (const topic of this.topics) {
      for (const subtopic of topic.subtopics) {
        if (isCurrentTopic) {
          return subtopic.id;
        }
        if (subtopic.id === this.subtopicId) {
          isCurrentTopic = true;
        }
      }
    }
    return null;
  }
}
