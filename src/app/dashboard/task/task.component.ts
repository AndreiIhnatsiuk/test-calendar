import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {FullTask} from '../../entities/full-task';
import {Submission} from '../../entities/submission';
import {SubmissionService} from '../../services/submission.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  displayedColumns = ['status', 'wrongTest', 'maxExecutionTime', 'actions'];
  task: FullTask;
  submissions: Array<Submission>;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private submissionService: SubmissionService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      const taskId = +map.get('taskId');
      this.taskService.getTaskById(taskId).subscribe(fullTask => this.task = fullTask);
      this.submissionService.getSubmissionsByTaskId(taskId).subscribe(submissions => this.submissions = submissions);
    });
  }
}
