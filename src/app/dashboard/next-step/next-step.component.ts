import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Topic} from '../../entities/topic';
import {AvailableLessonsService} from '../../services/available-lessons.service';
import * as routes from '../routes';
import {Subscription, zip} from 'rxjs';
import {Problem} from '../../entities/problem';
import {ProblemService} from '../../services/problem.service';
import {TopicService} from '../../services/topic.service';
import {AvailableProblemsService} from '../../services/available-problem.service';

@Component({
  selector: 'app-next-step',
  templateUrl: './next-step.component.html',
  styleUrls: ['./next-step.component.scss']
})
export class NextStepComponent implements OnChanges, OnInit, OnDestroy {
  @Input() problemId: number;
  @Input() lessonId: number;

  moduleId: number;
  problems: Array<Problem>;
  oldLessonId: number;
  topics: Array<Topic>;
  availableLessons: Set<number>;
  urlToLesson: string;
  availableLessonsSubscription: Subscription;
  urlToNextStep: Array<any>;
  availableProblemIds: Set<number>;
  private availableProblemsSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private problemService: ProblemService,
              private availableLessonsService: AvailableLessonsService,
              private availableProblemsService: AvailableProblemsService,
              private topicService: TopicService) {
    this.oldLessonId = this.lessonId;
    this.topics = new Array<Topic>();
    this.availableLessons = new Set<number>();
    this.urlToLesson = '/' + routes.DASHBOARD + '/' + routes.MODULE;
    this.availableProblemIds = new Set<number>();
  }

  ngOnInit() {
    this.moduleId = Number.parseFloat(this.route.parent.snapshot.paramMap.get('moduleId'));
    zip(
      this.topicService.getTopics(this.moduleId),
      this.problemService.getProblemsByLessonId(this.lessonId),
    ).subscribe(([topics, problems]) => {
      this.topics = topics;
      this.problems = problems;
      this.urlToNextStep = this.getNextStepLink();
    });
    this.availableLessonsSubscription = this.availableLessonsService.getAvailableLessons(this.moduleId)
      .subscribe(availableLessons => {
        this.availableLessons = availableLessons;
        this.urlToNextStep = this.getNextStepLink();
      });
  }

  ngOnChanges() {
    if (this.availableProblemsSubscription) {
      this.availableProblemsSubscription.unsubscribe();
      this.availableProblemsSubscription = undefined;
    }
    if (this.oldLessonId !== this.lessonId) {
      this.oldLessonId = this.lessonId;
      this.problemService.getProblemsByLessonId(this.lessonId).subscribe(problems => {
        this.problems = problems;
        if (this.problems) {
          this.availableProblemsSubscription =
            this.availableProblemsService.getAvailableProblemsByProblemIdIn(this.problems.map(x => x.id))
              .subscribe(availableProblemIds => {
                this.availableProblemIds = availableProblemIds;
                this.urlToNextStep = this.getNextStepLink();
              });
        }
        this.urlToNextStep = this.getNextStepLink();
      });
    } else {
      this.urlToNextStep = this.getNextStepLink();
    }
  }

  ngOnDestroy() {
    if (this.availableLessonsSubscription) {
      this.availableLessonsSubscription.unsubscribe();
    }
    if (this.availableProblemsSubscription) {
      this.availableProblemsSubscription.unsubscribe();
    }
  }

  getNextStepLink() {
    if (!this.problemId) {
      if (this.problems && this.problems.length > 0) {
        if (!this.availableProblemIds.has(this.problems[0].id)) {
          return null;
        }
        return [this.urlToLesson, this.moduleId, routes.LESSON, this.lessonId, routes.PROBLEM, this.problems[0].id];
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
        if (!this.availableProblemIds.has(problem.id)) {
          return null;
        }
        return [this.urlToLesson, this.moduleId, routes.LESSON, this.lessonId, routes.PROBLEM, problem.id];
      }
      if (this.problemId === problem.id) {
        isCurrentTask = true;
      }
    }
  }

  getNextLessonLink() {
    const nextLessonId = this.getNextLessonId();
    if (this.availableLessons.has(nextLessonId)) {
      return [this.urlToLesson, this.moduleId, routes.LESSON, nextLessonId];
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
