import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubtopicService} from '../../services/subtopic.service';
import {Topic} from '../../entities/topic';
import {Task} from '../../entities/task';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {concat, of, Subscription} from 'rxjs';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';
import {Question} from '../../entities/question';
import {QuestionService} from '../../services/question.service';
import {AvailableTopicsService} from '../../services/available-topics.service';

@Component({
  selector: 'app-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.scss']
})
export class BeginnerComponent implements OnInit, OnDestroy {
  topics: Array<Topic>;
  tasks: Array<Task>;
  questions: Array<Question>;
  acceptedTasks: Set<number>;
  subtopicId: number;
  availableTopics: Set<number>;
  topicId: number;
  taskId: number;
  questionId: number;
  acceptedTasksBySubtopics: Map<number, number>;
  countTasksBySubtopics: Map<number, number>;
  private acceptedTasksSubscription: Subscription;
  private acceptedTasksBySubtopicsSubscription: Subscription;
  private availableTopicsSubscription: Subscription;

  constructor(private subtopicService: SubtopicService,
              private taskService: TaskService,
              private questionService: QuestionService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private availableTopicsService: AvailableTopicsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.acceptedTasks = new Set<number>();
    this.availableTopics = new Set<number>();
  }

  ngOnInit() {
    this.subtopicService.getTopics()
      .subscribe(topics => this.topics = topics);
    this.acceptedTasksBySubtopicsSubscription = this.acceptedSubmissionService.getAcceptedBySubtopics()
      .subscribe(accepted => this.acceptedTasksBySubtopics = accepted);
    this.taskService.countBySubtopic()
      .subscribe(number => this.countTasksBySubtopics = number);
    this.availableTopicsSubscription = this.availableTopicsService.getAvailableTopics()
      .subscribe(availableTopics => this.availableTopics = new Set(availableTopics));

    concat(
      of(this.route.firstChild),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route.firstChild)
      )
    )
      .pipe(switchMap(route => route.paramMap))
      .subscribe(paramMap => {
        const topicId = +paramMap.get('subtopicId');
        const taskId = +paramMap.get('taskId');
        const questionId = +paramMap.get('questionId');
        if (topicId !== this.subtopicId) {
          this.subtopicId = topicId;
          this.taskService.getTasksBySubtopicId(this.subtopicId).subscribe(tasks => {
            this.tasks = tasks;
            this.updateAccepted();
          });
          this.questionService.getQuestionsBySubtopicId(this.subtopicId).subscribe(questions => {
            this.questions = questions;
            this.updateAccepted();
          });
        } else if (taskId !== this.taskId || questionId !== this.questionId) {
          this.updateAccepted();
        }
        this.taskId = taskId;
        this.questionId = questionId;
      });
  }

  ngOnDestroy(): void {
    if (this.acceptedTasksSubscription) {
      this.acceptedTasksSubscription.unsubscribe();
    }
    if (this.acceptedTasksBySubtopicsSubscription) {
      this.acceptedTasksBySubtopicsSubscription.unsubscribe();
    }
    if (this.availableTopicsSubscription) {
      this.availableTopicsSubscription.unsubscribe();
    }
  }

  private updateAccepted() {
    if (this.acceptedTasksSubscription) {
      this.acceptedTasksSubscription.unsubscribe();
      this.acceptedTasksSubscription = undefined;
    }
    if (this.tasks) {
      this.acceptedTasksSubscription = this.acceptedSubmissionService.getAccepted(this.tasks.map(x => x.id))
        .subscribe(accepted => this.acceptedTasks = accepted);
    }
    if (this.availableTopicsSubscription) {
      this.availableTopicsSubscription.unsubscribe();
      this.availableTopicsSubscription = undefined;
    }
    this.availableTopicsSubscription = this.availableTopicsService.getAvailableTopics()
      .subscribe(availableTopics => this.availableTopics = new Set(availableTopics));
  }

  public getAccepted(id: number) {
    if (!this.acceptedTasksBySubtopics) {
      return '';
    }
    const accepted = this.acceptedTasksBySubtopics.get(id);
    return accepted ? accepted : 0;
  }

  public getTotal(id: number) {
    if (!this.countTasksBySubtopics) {
      return '';
    }
    const count = this.countTasksBySubtopics.get(id);
    return count ? count : '-';
  }
}
