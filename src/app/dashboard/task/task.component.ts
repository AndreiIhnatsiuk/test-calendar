import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {FullTask} from '../../entities/full-task';
import {Submission} from '../../entities/submission';
import {SubmissionService} from '../../services/submission.service';
import {SubmissionRequest} from '../../entities/submission-request';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SubmissionStatus} from '../../entities/submission-status';
import {SubmissionComponent} from '../submission/submission.component';

import 'brace';
import 'brace/mode/java';
import 'brace/theme/github';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskComponent implements OnInit {
  taskId: number;
  displayedColumns = ['status', 'wrongTest', 'maxExecutionTime', 'actions'];
  task: FullTask;
  submissions: Array<Submission>;
  solution: string;

  sending = false;
  running: boolean;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private submissionService: SubmissionService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.taskId = +map.get('taskId');
      this.solution = 'public class Task' + this.taskId + ' {\n    public static void main(String[] args) {\n        \n    }\n}\n';
      this.taskService.getTaskById(this.taskId).subscribe(fullTask => this.task = fullTask);
      this.updateSubmission(this);
    });
  }

  send() {
    this.sending = true;
    const submission = new SubmissionRequest(this.taskId, this.solution);
    this.submissionService.postSubmission(submission).subscribe(() => {
      this.sending = false;
      this.snackBar.open('Решение отправлено.', undefined, {
        duration: 5000
      });
      this.updateSubmission(this);
    }, error => {
      this.sending = false;
      this.snackBar.open(error.error.message, undefined, {
        duration: 5000
      });
    });
  }

  private updateSubmission(self: TaskComponent) {
    self.running = true;
    self.submissionService.getSubmissionsByTaskId(self.taskId).subscribe(submissions => {
      self.submissions = submissions;
      self.running = submissions
        .filter(submission => {
          const status = SubmissionStatus[submission.status];
          return status === SubmissionStatus.IN_QUEUE || status === SubmissionStatus.RUNNING;
        })
        .length > 0;
      if (this.running) {
        setTimeout(() => {
          self.updateSubmission(self);
        }, 2500);
      }
    });
  }

  isRunning(submission: Submission): boolean {
    const status = SubmissionStatus[submission.status];
    return (status === SubmissionStatus.IN_QUEUE || status === SubmissionStatus.RUNNING);
  }

  showMore(submission: Submission): boolean {
    const status = SubmissionStatus[submission.status];
    return !(status === SubmissionStatus.IN_QUEUE || status === SubmissionStatus.RUNNING || status === SubmissionStatus.ACCEPTED);
  }

  seeMore(submission: Submission) {
    if (!this.showMore(submission)) {
      return;
    }
    this.dialog.open(SubmissionComponent, {data: submission.id});
  }
}
