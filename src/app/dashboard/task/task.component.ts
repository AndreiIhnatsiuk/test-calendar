import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TaskService} from '../../services/task.service';
import {FullTask} from '../../entities/full-task';
import {Submission} from '../../entities/submission';
import {SubmissionService} from '../../services/submission.service';
import {SubmissionRequest} from '../../entities/submission-request';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SubmissionStatus} from '../../entities/submission-status';
import {SubmissionComponent} from '../submission/submission.component';

import 'brace';
import 'brace/mode/java';
import 'brace/theme/github';
import {Gtag} from 'angular-gtag';
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskComponent implements OnInit {
  @Input() startDate: Date;
  @Input() endDate: Date;

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
              private acceptedSubmissionService: AcceptedSubmissionService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private gtag: Gtag) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.taskId = +map.get('taskId');
      if (this.taskId <= 2) {
        this.solution = 'public class Task' + this.taskId + ' {\n    public static void main(String[] args) {\n        \n    }\n}\n';
      } else {
        this.solution = 'import java.util.Scanner;\n\npublic class Task' + this.taskId +
          ' {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        \n    }\n}\n';
      }
      this.taskService.getTaskById(this.taskId).subscribe(fullTask => this.task = fullTask);
      this.updateSubmission(this, true);
    });
  }

  send() {
    this.sending = true;
    const submission = new SubmissionRequest(this.taskId, this.solution);
    this.gtag.event('sending', {
      event_category: 'submission',
      event_label: this.taskId.toString()
    });
    this.submissionService.postSubmission(submission).subscribe(() => {
      this.gtag.event('sent', {
        event_category: 'submission',
        event_label: this.taskId.toString()
      });
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

  private updateSubmission(self: TaskComponent, first?: boolean) {
    self.running = true;
    self.submissionService.getSubmissionsByTaskId(self.taskId, this.startDate, this.endDate).subscribe(submissions => {
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
      } else if (first === undefined) {
        self.acceptedSubmissionService.update(self.taskId);
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

  isSendDisabled(): boolean {
    if (!this.endDate) {
      return false;
    }
    return this.endDate.getTime() - new Date().getTime() < 0;
  }
}
