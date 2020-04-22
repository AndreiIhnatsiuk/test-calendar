import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {AcceptedSubmissionService} from '../../services/accepted-submission.service';
import {AceComponent} from 'ngx-ace-wrapper';

import 'brace';
import 'brace/mode/java';
import 'brace/theme/github';
import {Gtag} from 'angular-gtag';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {StoredSolution} from '../../entities/stored-solution';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() startDate: Date;
  @Input() endDate: Date;
  @ViewChild(AceComponent, { static: false }) ace?: AceComponent;

  taskId: number;
  displayedColumns = ['status', 'wrongTest', 'maxExecutionTime', 'actions'];
  task: FullTask;
  submissions: Array<Submission>;
  solution: string;
  editSubject: Subject<string>;
  storedSolution: StoredSolution;
  submissionsSubscription: Subscription;

  sending = false;
  running: boolean;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private submissionService: SubmissionService,
              private acceptedSubmissionService: AcceptedSubmissionService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private gtag: Gtag) {
    this.editSubject = new Subject<string>();
    this.editSubject
      .pipe(debounceTime(1000))
      .subscribe(solution => this.storeSolution(solution));
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.taskId = +map.get('taskId');
      this.taskService.getTaskById(this.taskId).subscribe(fullTask => {
        this.task = fullTask;
        if (this.storedSolution == null || !this.storedSolution.solution) {
          this.initDefaultSolution();
        }
      });
      if (!this.endDate) {
        this.storedSolution = this.submissionService.getSolution(this.taskId);
        if (this.storedSolution) {
          this.solution = this.storedSolution.solution;
        }
      }
      if (this.submissionsSubscription) {
        this.submissionsSubscription.unsubscribe();
      }
      this.submissionsSubscription = this.submissionService
        .getSubmissionsByTaskId(this.taskId, this.startDate, this.endDate)
        .subscribe(submissions => {
          this.submissions = submissions;
          this.running = submissions.findIndex(x => this.isRunning(x)) !== -1;
        });
    });
  }

  ngOnDestroy(): void {
    if (this.submissionsSubscription) {
      this.submissionsSubscription.unsubscribe();
    }
  }

  initDefaultSolution() {
    if (this.task.tests && this.task.tests.length && this.task.tests[0].input) {
      this.solution = 'import java.util.Scanner;\n\npublic class Task' + this.taskId +
        ' {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        \n    }\n}\n';
    } else {
      this.solution = 'public class Task' + this.taskId + ' {\n    public static void main(String[] args) {\n        \n    }\n}\n';
    }
  }

  storeSolution(solution: string, submissionId?: string) {
    const storedSolution: StoredSolution = {
      taskId: this.taskId,
      solution: solution,
      submissionId: submissionId
    };
    this.submissionService.storeSolution(storedSolution);
  }

  send() {
    this.sending = true;
    const submission = new SubmissionRequest(this.taskId, this.solution);
    this.submissionService.postSubmission(submission).subscribe(added => {
      this.gtag.event('sent', {
        event_category: 'submission',
        event_label: this.taskId.toString()
      });
      this.sending = false;
      this.running = true;
      this.snackBar.open('Решение отправлено.', undefined, {
        duration: 5000
      });
      this.submissions = [added, ...this.submissions];
      if (this.solution === submission.solution) {
        this.storeSolution(this.solution, added.id);
      }
    }, error => {
      this.gtag.event('sending-error', {
        event_category: 'submission',
        event_label: this.taskId.toString()
      });
      this.sending = false;
      this.snackBar.open(error.error.message, undefined, {
        duration: 5000
      });
    });
  }

  isRunning(submission: Submission): boolean {
    return this.submissionService.isRunning(submission);
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
