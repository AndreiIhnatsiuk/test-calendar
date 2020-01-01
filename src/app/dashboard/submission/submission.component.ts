import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SubmissionService} from '../../services/submission.service';
import {FullSubmission} from '../../entities/full-submission';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {
  submission: FullSubmission;

  constructor(private dialogRef: MatDialogRef<SubmissionComponent>,
              @Inject(MAT_DIALOG_DATA) public id: string,
              private submissionService: SubmissionService) { }

  ngOnInit() {
    this.submissionService.getSubmissionById(this.id).subscribe(submission => this.submission = submission);
  }

  close(): void {
    this.dialogRef.close();
  }
}
