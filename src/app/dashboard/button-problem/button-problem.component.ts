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
  @Input() problemStatus: string;
  @Input() existSubmissions: boolean;

  status: string;

  ngOnChanges() {
    this.status = this.getStatus();
  }

  getStatus() {
    if (this.existSubmissions) {
      return this.problemStatus;
    } else if (this.isAvailable) {
      return 'AVAILABLE';
    }
  }
}
