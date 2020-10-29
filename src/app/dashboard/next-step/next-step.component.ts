import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../../entities/task';
import {Question} from '../../entities/question';
import {TaskService} from '../../services/task.service';
import {QuestionService} from '../../services/question.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Topic} from '../../entities/topic';
import {AvailableSubtopicsService} from '../../services/available-subtopics.service';
import {SubtopicService} from '../../services/subtopic.service';
import * as routes from '../routes';
import {forkJoin, Subscription, zip} from 'rxjs';

@Component({
  selector: 'app-next-step',
  templateUrl: './next-step.component.html',
  styleUrls: ['./next-step.component.scss']
})
export class NextStepComponent implements OnChanges, OnInit, OnDestroy {
  tasks: Array<Task>;
  questions: Array<Question>;
  @Input() questionId: number;
  @Input() taskId: number;
  @Input() subtopicId: number;
  topics: Array<Topic>;
  availableSubtopics: Set<number>;
  urlToSubtopic: string;
  availableSubtopicsSubscription: Subscription;
  urlToNextStep: Array<any>;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private availableTopicsService: AvailableSubtopicsService,
              private subtopicService: SubtopicService,
              private router: Router,
              private questionService: QuestionService) {
    this.topics = new Array<Topic>();
    this.availableSubtopics = new Set<number>();
    this.urlToSubtopic = '/' + routes.DASHBOARD + '/' + routes.JAVA + '/' + routes.SUBTOPIC;
  }

  ngOnInit() {
    zip(
      this.subtopicService.getTopics(),
      this.taskService.getTasksBySubtopicId(this.subtopicId),
      this.questionService.getQuestionsBySubtopicId(this.subtopicId),
    ).subscribe(([topics, tasks, questions]) => {
      this.topics = topics;
      this.tasks = tasks;
      this.questions = questions;
      this.urlToNextStep = this.getNextStepLink();
    });
    this.availableSubtopicsSubscription = this.availableTopicsService.getAvailableSubtopics()
      .subscribe(availableTopics => {
        this.availableSubtopics = availableTopics;
        this.urlToNextStep = this.getNextStepLink();
      });
  }

  ngOnChanges() {
    this.urlToNextStep = this.getNextStepLink();
  }

  ngOnDestroy() {
    if (this.availableSubtopicsSubscription) {
      this.availableSubtopicsSubscription.unsubscribe();
    }
  }

  getNextStepLink() {
    if (!this.questionId && !this.taskId) {
      if (this.questions && this.questions.length > 0) {
        return [this.urlToSubtopic, this.subtopicId, routes.QUESTION, this.questions[0].id];
      }
      if (this.tasks && this.tasks.length > 0) {
        return [this.urlToSubtopic, this.subtopicId, routes.TASK, this.tasks[0].id];
      }
    } else {
      if (this.questionId && this.questions) {
        return this.getNextQuestionLink();
      }
      if (this.taskId && this.tasks && this.tasks[this.tasks.length - 1].id !== this.taskId) {
        return this.getNextTaskLink();
      }
    }
    return this.getNextSubtopicLink();
  }

  getNextQuestionLink() {
    if (this.questions[this.questions.length - 1].id !== this.questionId) {
      let isCurrentQuestion = false;
      for (const question of this.questions) {
        if (isCurrentQuestion) {
          return [this.urlToSubtopic, this.subtopicId, routes.QUESTION, question.id];
        }
        if (this.questionId === question.id) {
          isCurrentQuestion = true;
        }
      }
    } else {
      if (this.tasks && this.tasks.length > 0) {
        return [this.urlToSubtopic, this.subtopicId, routes.TASK, this.tasks[0].id];
      } else {
        return this.getNextSubtopicLink();
      }
    }
  }

  getNextTaskLink() {
    let isCurrentTask = false;
    for (const task of this.tasks) {
      if (isCurrentTask) {
        return [this.urlToSubtopic, this.subtopicId, routes.TASK, task.id];
      }
      if (this.taskId === task.id) {
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
