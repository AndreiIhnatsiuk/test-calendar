import {Component, Input, OnChanges, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SubmissionService} from '../../services/submission.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SubmissionStatus} from '../../entities/submission-status';

import 'brace';
import 'brace/mode/java';
import 'brace/theme/github';
import {Gtag} from 'angular-gtag';
import {Subscription} from 'rxjs';
import {ProblemService} from '../../services/problem.service';
import {FullProblem} from '../../entities/full-problem';
import {FullSubmission} from '../../entities/full-submission';
import {BestLastFullSubmission} from '../../entities/best-last-full-submission';
import {GitTaskSubmissionRequest} from '../../entities/git-task-submission-request';
import {GitSubmissionComponent} from '../git-submission/git-submission.component';

@Component({
  selector: 'app-git-task',
  templateUrl: './git-task.component.html',
  styleUrls: ['./git-task.component.scss']
})

export class GitTaskComponent implements OnChanges, OnDestroy {
  @Input() problemId: number;
  @Input() lessonId: number;
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() type: string;

  problem: FullProblem;
  bestLastSubmission: BestLastFullSubmission;
  taskSubmissionsSubscription: Subscription;
  status: boolean = null;
  sending = false;
  running: boolean;
  pullRequestId: number;

  constructor(private route: ActivatedRoute,
              private problemService: ProblemService,
              private submissionService: SubmissionService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private gtag: Gtag) {
  }

  ngOnChanges() {
    this.pullRequestId = null;
    this.sending = false;
    this.problemService.getProblemById(this.problemId).subscribe(fullProblem => {
      this.problem = fullProblem;
    });
    if (this.taskSubmissionsSubscription) {
      this.taskSubmissionsSubscription.unsubscribe();
    }
    if (this.type === 'GitTask') {
      this.taskSubmissionsSubscription = this.submissionService
        .getGitTaskSubmissionsByProblemId(this.problemId).subscribe(bestLastSubmission => {
          this.update(bestLastSubmission);
        });
    }
    if (this.type === 'GitManualTask') {
      this.taskSubmissionsSubscription =
        this.submissionService.getGitManualTaskSubmissionsByProblemId(this.problemId).subscribe(bestLastSubmission => {
          this.update(bestLastSubmission);
        });
    }
  }

  update(bestLastSubmission: BestLastFullSubmission) {
    this.bestLastSubmission = bestLastSubmission;
    this.status = this.bestLastSubmission && this.bestLastSubmission.last && this.bestLastSubmission.last.status === 'Accepted';
    if (bestLastSubmission.last != null) {
      this.running = this.submissionService.isTaskRunning(this.bestLastSubmission.last);
    }
  }

  ngOnDestroy(): void {
    if (this.taskSubmissionsSubscription) {
      this.taskSubmissionsSubscription.unsubscribe();
    }
  }

  send() {
    this.sending = true;
    const submission = new GitTaskSubmissionRequest(this.problemId, this.pullRequestId);
    this.pullRequestId = null;
    if (this.type === 'GitTask') {
      this.submissionService.postGitTaskSubmission(submission)
        .subscribe(added => this.handleSending(added), error => this.handleSendingError(error));
    }
    if (this.type === 'GitManualTask') {
      this.submissionService.postGitTaskManualSubmission(submission)
        .subscribe(added => this.handleSending(added), error => this.handleSendingError(error));
    }
  }

  handleSending(added) {
    this.gtag.event('sent', {
      event_category: 'submission',
      event_label: this.problemId.toString()
    });
    this.sending = false;
    this.snackBar.open('Решение отправлено.', undefined, {
      duration: 2500
    });
    if (added) {
      this.bestLastSubmission.last = added;
      this.status = added.status === 'Accepted';
    }
  }

  handleSendingError(error) {
    this.gtag.event('sending-error', {
      event_category: 'submission',
      event_label: this.problemId.toString()
    });
    this.sending = false;
    this.snackBar.open(error.error.message, undefined, {
      duration: 5000
    });
  }

  showMore(submission: FullSubmission): boolean {
    const status = SubmissionStatus[submission.status];
    return !(status === SubmissionStatus.InQueue || status === SubmissionStatus.Running);
  }

  seeMore(submission: FullSubmission) {
    if (!this.showMore(submission)) {
      return;
    }
    this.gtag.event('see-more', {
      event_category: 'submission',
      event_label: '' + this.problemId
    });
    this.dialog.open(GitSubmissionComponent, {data: submission});
  }

  isSendDisabled(): boolean {
    if (!this.endDate) {
      return false;
    }
    return this.endDate.getTime() - new Date().getTime() < 0;
  }
}
