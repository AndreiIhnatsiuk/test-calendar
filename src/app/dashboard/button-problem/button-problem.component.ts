import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-button-problem',
  templateUrl: './button-problem.component.html',
  styleUrls: ['./button-problem.component.scss']
})
export class ButtonProblemComponent implements OnChanges {
  @Input() currentProblemId: number;
  @Input() problemId: number;
  @Input() problemType: string;
  @Input() moduleId: number;
  @Input() lessonId: number;
  @Input() isAvailable: boolean;
  @Input() isAccepted: boolean;
  @Input() existSubmissions: boolean;

  status: string;

  ngOnChanges() {
    this.status = this.getStatus();
  }

  getStatus() {
    if (this.existSubmissions) {
      if (this.isAccepted) {
        return 'green';
      } else {
        if (this.problemType === 'GIT_MANUAL_TASK') {
          return 'orange';
        }
        return 'red';
      }
    }
    if (this.isAvailable) {
      return 'blue';
    }
  }
}
