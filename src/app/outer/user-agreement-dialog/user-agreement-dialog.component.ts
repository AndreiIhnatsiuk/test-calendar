import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-user-agreement-dialog',
  templateUrl: './user-agreement-dialog.component.html',
  styleUrls: ['./user-agreement-dialog.component.scss']
})
export class UserAgreementDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<UserAgreementDialogComponent>) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
