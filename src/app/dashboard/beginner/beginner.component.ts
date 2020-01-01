import { Component, OnInit } from '@angular/core';
import {TopicService} from '../../services/topic.service';
import {Topic} from '../../entities/topic';
import {Task} from '../../entities/task';
import {ActivatedRoute, NavigationEnd, ParamMap, Router} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {concat, of, timer} from 'rxjs';

@Component({
  selector: 'app-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.scss']
})
export class BeginnerComponent implements OnInit {
  topics: Array<Topic>;
  tasks: Array<Task>;
  acceptedTasks: Set<number>;
  topicId: number;
  taskId: number;

  constructor(private topicService: TopicService,
              private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute) {
    this.acceptedTasks = new Set<number>();
  }

  ngOnInit() {
    this.topicService.getTopics().subscribe(topics => this.topics = topics);
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
            this.getAccepted();
          });
        } else if (taskId !== this.taskId) {
          this.getAccepted();
        }
        this.taskId = taskId;
      });
  }

  private getAccepted() {
    if (this.tasks) {
      this.taskService.getAccepted(this.tasks).subscribe(accepted => this.acceptedTasks = accepted);
    }
  }
}
