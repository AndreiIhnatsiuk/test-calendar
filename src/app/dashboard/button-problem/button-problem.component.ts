import {Component, Input, OnChanges} from '@angular/core';

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
  @Input() topicId: number;
  @Input() isAvailable: boolean;
  @Input() problemStatus: string;
  @Input() existSubmissions: boolean;

  status: string;

  title: { [k: string]: string } = {
    'OptionQuestion': 'Вопрос',
    'InputQuestion': 'Вопрос',
    'Task': 'Задача',
    'GitTask': 'Задача',
    'ManualTask': 'Задача',
    'FeedbackProblem': 'Отзыв',
    'Theory': 'Теория',
    'GitManualTask': 'Задача с ручной проверкой'
  };

  ngOnChanges() {
    this.status = this.getStatus();
  }

  getStatus() {
    if (this.existSubmissions) {
      return this.problemStatus;
    } else if (this.isAvailable) {
      return 'Available';
    }
  }
}
