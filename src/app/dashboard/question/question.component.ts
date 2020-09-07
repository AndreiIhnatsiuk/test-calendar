import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FullQuestion} from '../../entities/full-question';
import {QuestionService} from '../../services/question.service';
import {Personal} from '../../entities/personal';
import {AuthService} from '../../services/auth.service';
import {Gtag} from 'angular-gtag';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  questionId: number;
  question: FullQuestion;
  selectedOptions: number[] = [];
  multiple: boolean;
  classTrue: boolean;
  classFalse: boolean;
  buttonText = 'Отправить';
  rightAnswer = '';
  selectedOption: number;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private questionService: QuestionService) {
    this.classFalse = false;
    this.classTrue = false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.questionId = +map.get('questionId');
      this.questionService.getQuestionById(this.questionId).subscribe(fullQuestion => {
        this.question = fullQuestion;
        this.multiple = fullQuestion.multiple;
      });
      this.questionService.getAnswerUser(this.questionId).subscribe(right => {
        if (right !== null) {
          if (right.right) {
            this.rightAnswer = 'Все правильно';
          } else {
            this.rightAnswer = 'Неверный ответ';
          }
          this.buttonText = 'Попробовать снова';
        }
      });
    });
  }

  onNgModelChange(event) {
  }

  send() {
    if (this.buttonText === 'Попробовать снова') {
      this.selectedOptions = [];
      this.selectedOption = null;
      this.buttonText = 'Отправить';
      this.rightAnswer = '';
    } else if (this.selectedOptions.length > 0 || this.selectedOption !== null) {
      if (!this.multiple) {
        this.selectedOptions = [this.selectedOption];
      }
      this.route.paramMap.subscribe(map => {
        this.questionService.sendAnswerUser(this.questionId, this.selectedOptions).subscribe(right => {
            if (right.right) {
              this.rightAnswer = 'Все правильно';
            } else {
              this.rightAnswer = 'Неверный ответ';
            }
            this.buttonText = 'Попробовать снова';
        });
      });
    }
  }
}
