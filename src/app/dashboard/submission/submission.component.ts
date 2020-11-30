import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SubmissionService} from '../../services/submission.service';
import {FullSubmission} from '../../entities/full-submission';
import {BestLastFullSubmission} from '../../entities/best-last-full-submission';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SubmissionComponent>,
              @Inject(MAT_DIALOG_DATA) public submission: FullSubmission) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}
