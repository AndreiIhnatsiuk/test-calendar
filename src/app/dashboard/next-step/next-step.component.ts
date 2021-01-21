import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Topic} from '../../entities/topic';
import {AvailableLessonsService} from '../../services/available-lessons.service';
import * as routes from '../routes';
import {Subscription, zip} from 'rxjs';
import {Problem} from '../../entities/problem';
import {ProblemService} from '../../services/problem.service';
import {TopicService} from '../../services/topic.service';

@Component({
  selector: 'app-next-step',
  templateUrl: './next-step.component.html',
  styleUrls: ['./next-step.component.scss']
})
export class NextStepComponent implements OnChanges, OnInit, OnDestroy {
  @Input() problemId: number;
  @Input() lessonId: number;

  problems: Array<Problem>;
  oldLessonId: number;
  topics: Array<Topic>;
  availableLessons: Set<number>;
  urlToLesson: string;
  availableLessonsSubscription: Subscription;
  urlToNextStep: Array<any>;

  constructor(private route: ActivatedRoute,
              private problemService: ProblemService,
              private availableTopicsService: AvailableLessonsService,
              private topicService: TopicService) {
    this.oldLessonId = this.lessonId;
    this.topics = new Array<Topic>();
    this.availableLessons = new Set<number>();
    this.urlToLesson = '/' + routes.DASHBOARD + '/' + routes.JAVA + '/' + routes.LESSON;
  }

  ngOnInit() {
    zip(
      this.topicService.getTopics(),
      this.problemService.getProblemsByLessonId(this.lessonId),
    ).subscribe(([topics, problems]) => {
      this.topics = topics;
      this.problems = problems;
      this.urlToNextStep = this.getNextStepLink();
    });
    this.availableLessonsSubscription = this.availableTopicsService.getAvailableLessons()
      .subscribe(availableTopics => {
        this.availableLessons = availableTopics;
        this.urlToNextStep = this.getNextStepLink();
      });
  }

  ngOnChanges() {
    if (this.oldLessonId !== this.lessonId) {
      this.oldLessonId = this.lessonId;
      zip(
        this.problemService.getProblemsByLessonId(this.lessonId),
      ).subscribe(([problems]) => {
        this.problems = problems;
        this.urlToNextStep = this.getNextStepLink();
      });
    }
  }

  ngOnDestroy() {
    if (this.availableLessonsSubscription) {
      this.availableLessonsSubscription.unsubscribe();
    }
  }

  getNextStepLink() {
    if (!this.problemId) {
      if (this.problems && this.problems.length > 0) {
        return [this.urlToLesson, this.lessonId, routes.PROBLEM, this.problems[0].id];
      }
    } else {
      if (this.problemId && this.problems && this.problems[this.problems.length - 1].id !== this.problemId) {
        return this.getNextProblemLink();
      }
    }
    return this.getNextLessonLink();
  }

  getNextProblemLink() {
    let isCurrentTask = false;
    for (const problem of this.problems) {
      if (isCurrentTask) {
        return [this.urlToLesson, this.lessonId, routes.PROBLEM, problem.id];
      }
      if (this.problemId === problem.id) {
        isCurrentTask = true;
      }
    }
  }

  getNextLessonLink() {
    const nextLessonId = this.getNextLessonId();
    if (this.availableLessons.has(nextLessonId)) {
      return [this.urlToLesson, nextLessonId];
    }
    return null;
  }

  getNextLessonId() {
    let isCurrentTopic = false;
    for (const topic of this.topics) {
      for (const lesson of topic.lessons) {
        if (isCurrentTopic) {
          return lesson.id;
        }
        if (lesson.id === this.lessonId) {
          isCurrentTopic = true;
        }
      }
    }
    return null;
  }
}
