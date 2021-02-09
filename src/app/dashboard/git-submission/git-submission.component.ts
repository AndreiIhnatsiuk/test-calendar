import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FullSubmission} from '../../entities/full-submission';

@Component({
  selector: 'app-git-submission',
  templateUrl: './git-submission.component.html',
  styleUrls: ['./git-submission.component.scss']
})
export class GitSubmissionComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<GitSubmissionComponent>,
              @Inject(MAT_DIALOG_DATA) public submission: FullSubmission) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}
