import {Component, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../../entities/task';
import {Question} from '../../entities/question';
import {concat, of, Subscription} from 'rxjs';
import {SubtopicService} from '../../services/subtopic.service';
import {TaskService} from '../../services/task.service';
import {QuestionService} from '../../services/question.service';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';
import {AvailableSubtopicsService} from '../../services/available-subtopics.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
  tasks: Array<Task>;
  questions: Array<Question>;
  acceptedTasks: Map<number, boolean>;
  acceptedQuestions: Map<number, boolean>;
  subtopicId: number;
  taskId: number;
  questionId: number;
  private acceptedTasksSubscription: Subscription;
  private acceptedQuestionsSubscription: Subscription;

  constructor(private subtopicService: SubtopicService,
              private taskService: TaskService,
              private questionService: QuestionService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private availableTopicsService: AvailableSubtopicsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.acceptedTasks = new Map<number, boolean>();
    this.acceptedQuestions = new Map<number, boolean>();
  }

  ngOnInit() {
    concat(
      of(this.route.firstChild.firstChild),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd && this.route.firstChild.firstChild !== null),
        map(() => this.route.firstChild.firstChild)
      )
    )
      .pipe(switchMap(route => route.paramMap))
      .subscribe(paramMap => {
        const subtopicId = +paramMap.get('subtopicId');
        const taskId = +paramMap.get('taskId');
        const questionId = +paramMap.get('questionId');
        if (subtopicId !== this.subtopicId) {
          this.subtopicId = subtopicId;
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
    if (this.acceptedQuestionsSubscription) {
      this.acceptedQuestionsSubscription.unsubscribe();
    }
  }

  private updateAccepted() {
    if (this.acceptedTasksSubscription) {
      this.acceptedTasksSubscription.unsubscribe();
      this.acceptedTasksSubscription = undefined;
    }
    if (this.acceptedQuestionsSubscription) {
      this.acceptedQuestionsSubscription.unsubscribe();
      this.acceptedQuestionsSubscription = undefined;
    }
    if (this.tasks) {
      this.acceptedTasksSubscription = this.acceptedSubmissionService.getAccepted(this.tasks.map(x => x.id))
        .subscribe(accepted => this.acceptedTasks = accepted);
    }
    if (this.questions) {
      this.acceptedQuestionsSubscription = this.questionService.getAcceptedByQuestionIds(this.questions.map(x => x.id))
        .subscribe(questions => this.acceptedQuestions = questions);
    }
  }
}
