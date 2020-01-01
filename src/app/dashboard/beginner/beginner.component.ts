import { Component, OnInit } from '@angular/core';
import {TopicService} from '../../services/topic.service';
import {Topic} from '../../entities/topic';
import {Task} from '../../entities/task';
import {ActivatedRoute, NavigationEnd, ParamMap, Router} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {concat, of} from 'rxjs';

@Component({
  selector: 'app-beginner',
  templateUrl: './beginner.component.html',
  styleUrls: ['./beginner.component.scss']
})
export class BeginnerComponent implements OnInit {
  topics: Array<Topic>;
  tasks: Array<Task>;
  topicId: number;
  taskId: number;

  constructor(private topicService: TopicService,
              private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute) { }

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
        const newId = +paramMap.get('topicId');
        if (newId !== this.topicId) {
          this.topicId = newId;
          this.taskService.getTasksByTopicId(this.topicId).subscribe(tasks => this.tasks = tasks);
        }
        this.taskId = +paramMap.get('taskId');
      });
  }
}
