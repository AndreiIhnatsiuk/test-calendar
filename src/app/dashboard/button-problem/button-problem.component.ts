import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button-problem',
  templateUrl: './button-problem.component.html',
  styleUrls: ['./button-problem.component.scss']
})
export class ButtonProblemComponent implements OnInit {
  @Input() currentProblemId: number;
  @Input() problemId: number;
  @Input() problemType: string;
  @Input() moduleId: number;
  @Input() lessonId: number;
  @Input() isAvailable: boolean;
  @Input() isAccepted: boolean;
  @Input() existSubmissions: boolean;

  ngOnInit() {
  }

  getStatus() {
    if (this.existSubmissions && this.isAccepted) {
      return 'green';
    }
    if (this.existSubmissions && !this.isAccepted) {
      if (this.problemType === 'GIT_MANUAL_TASK') {
        return 'orange';
      }
      return 'red';
    }
    if (this.isAvailable) {
      return 'blue';
    }
  }
}
