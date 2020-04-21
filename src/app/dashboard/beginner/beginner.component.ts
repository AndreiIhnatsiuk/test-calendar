import {Component, OnDestroy, OnInit} from '@angular/core';
import {TopicService} from '../../services/topic.service';
import {Topic} from '../../entities/topic';
import {Task} from '../../entities/task';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {concat, of, Subscription} from 'rxjs';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';

@Component({
  selector: 'app-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.scss']
})
export class BeginnerComponent implements OnInit, OnDestroy {
  topics: Array<Topic>;
  tasks: Array<Task>;
  acceptedTasks: Set<number>;
  topicId: number;
  taskId: number;
  acceptedTasksByTopics: Map<number, number>;
  countTasksByTopics: Map<number, number>;
  private acceptedTasksSubscription: Subscription;
  private acceptedTasksByTopicsSubscription: Subscription;

  constructor(private topicService: TopicService,
              private taskService: TaskService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private router: Router,
              private route: ActivatedRoute) {
    this.acceptedTasks = new Set<number>();
  }

  ngOnInit() {
    this.topicService.getTopics()
      .subscribe(topics => this.topics = topics);
    this.acceptedTasksByTopicsSubscription = this.acceptedSubmissionService.getAcceptedByTopics()
      .subscribe(accepted => this.acceptedTasksByTopics = accepted);
    this.taskService.countByTopic()
      .subscribe(number => this.countTasksByTopics = number);

    concat(
      of(this.route.firstChild),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route.firstChild)
      )
    )
      .pipe(switchMap(route => route.paramMap))
      .subscribe(paramMap => {
        const topicId = +paramMap.get('topicId');
        const taskId = +paramMap.get('taskId');
        if (topicId !== this.topicId) {
          this.topicId = topicId;
          this.taskService.getTasksByTopicId(this.topicId).subscribe(tasks => {
            this.tasks = tasks;
            this.updateAccepted();
          });
        } else if (taskId !== this.taskId) {
          this.updateAccepted();
        }
        this.taskId = taskId;
      });
  }

  ngOnDestroy(): void {
    if (this.acceptedTasksSubscription) {
      this.acceptedTasksSubscription.unsubscribe();
    }
    if (this.acceptedTasksByTopicsSubscription) {
      this.acceptedTasksByTopicsSubscription.unsubscribe();
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
  }

  public getAccepted(id: number) {
    if (!this.acceptedTasksByTopics) {
      return '';
    }
    const accepted = this.acceptedTasksByTopics.get(id);
    return accepted ? accepted : 0;
  }

  public getTotal(id: number) {
    if (!this.countTasksByTopics) {
      return '';
    }
    const count = this.countTasksByTopics.get(id);
    return count ? count : '-';
  }
}
