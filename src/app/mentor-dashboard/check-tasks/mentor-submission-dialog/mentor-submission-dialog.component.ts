import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MentorSubmissionService} from '../../../services/mentor-submission.service';
import {MentorSubmissionRequest} from '../../../entities/mentor-submission-request';

@Component({
  selector: 'app-mentor-submission-dialog',
  templateUrl: './mentor-submission-dialog.component.html',
  styleUrls: ['./mentor-submission-dialog.component.scss']
})
export class MentorSubmissionDialogComponent {
  status: string;
  comment: string;
  statuses: string[] = ['Accepted', 'WrongAnswer'];
  sending = false;

  constructor(private mentorSubmissionService: MentorSubmissionService,
              private dialogRef: MatDialogRef<MentorSubmissionDialogComponent>,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public id: string) {
  }

  send(comment: string, status: string, id: string): void {
    this.sending = true;
    const sub = new MentorSubmissionRequest(status, comment);
    this.mentorSubmissionService.sentMentorReviewOnSubmission(sub, id).subscribe((() => {
      this.sending = false;
      this.snackBar.open('Отправлено', undefined, {
        duration: 10000
      });
      this.close();
    }), err => {
      this.sending = false;
      this.snackBar.open(err.error.message, undefined, {
        duration: 10000
      });
      this.close();
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
