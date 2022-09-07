import { Component, OnInit } from '@angular/core';
import {MentorSubmission} from '../entities/mentor-submission';
import {MentorSubmissionService} from '../services/mentor-submission.service';
import {MatDialog} from '@angular/material/dialog';
import {MentorSubmissionDialogComponent} from './mentor-submission-dialog/mentor-submission-dialog.component';
import {Personal} from '../entities/personal';
import {AuthService} from '../services/auth.service';
import {Gtag} from 'angular-gtag';

@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.scss']
})
export class MentorDashboardComponent implements OnInit {
  personal: Personal;
  mentorSubmissions: Array<MentorSubmission>;
  dialogRef: any;

  constructor(private mentorService: MentorSubmissionService,
              private authService: AuthService,
              private gtag: Gtag,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getSubmissionsInQueue();
  }

  getSubmissionsInQueue() {
    this.mentorService.getManualSubmissionInQueue().subscribe(mentorSubmission => {
      this.mentorSubmissions = mentorSubmission;
    });
  }

  useDialog(id: string) {
    this.dialogRef = this.dialog.open(MentorSubmissionDialogComponent, {data: id});
    this.dialogRef.afterClosed().subscribe(() => this.getSubmissionsInQueue());
  }

  check(id: string): void {
    this.useDialog(id);
  }

}
