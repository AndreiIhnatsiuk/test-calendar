import {Component, OnInit} from '@angular/core';
import {MentorSubmissionService} from '../../services/mentor-submission.service';
import {MentorSubmission} from '../../entities/mentor-submission';
import {MatDialog} from '@angular/material/dialog';
import {MentorSubmissionDialogComponent} from '../mentor-submission-dialog/mentor-submission-dialog.component';

@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.scss']
})
export class MentorDashboardComponent implements OnInit {

  mentorSubmissions: Array<MentorSubmission>;
  dialogRef: any;

  constructor(private mentorService: MentorSubmissionService,
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
