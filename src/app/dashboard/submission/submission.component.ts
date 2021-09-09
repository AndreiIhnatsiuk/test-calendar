import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FullSubmission} from '../../entities/full-submission';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {


  constructor(private dialogRef: MatDialogRef<SubmissionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {submission: FullSubmission, totalTests: string}
              ) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}
