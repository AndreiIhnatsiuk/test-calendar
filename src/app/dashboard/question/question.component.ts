import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FullQuestion} from '../../entities/full-question';
import {QuestionService} from '../../services/question.service';
import {AuthService} from '../../services/auth.service';
import {UserAnswer} from '../../entities/user-answer';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  questionId: number;
  question: FullQuestion;
  userAnswer: UserAnswer = null;
  selectedAnswers: number[] = [];
  disabledButton = true;
  disabledCheckBox = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private questionService: QuestionService) {
  }

  onNgModelChange(event) {
    this.disabledButton = this.selectedAnswers.length <= 0;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.questionId = +map.get('questionId');
      this.questionService.getQuestionById(this.questionId).subscribe(fullQuestion => {
        this.question = fullQuestion;
      });
      this.questionService.getAnswerUser(this.questionId).subscribe(userAnswer => {
        if (userAnswer !== null) {
          this.userAnswer = userAnswer;
          this.disabledButton = false;
          this.disabledCheckBox = true;
        }
      });
    });
  }

  send() {
    this.disabledButton = true;
    if (this.userAnswer !== null) {
      this.selectedAnswers = [];
      this.userAnswer = null;
      this.disabledButton = true;
      this.disabledCheckBox = false;
    } else if (this.selectedAnswers.length > 0) {
      this.route.paramMap.subscribe(map => {
        this.questionService.sendAnswerUser(this.questionId, this.selectedAnswers).subscribe(userAnswer => {
          this.userAnswer = userAnswer;
          this.disabledButton = false;
          this.disabledCheckBox = true;
        });
      });
    }
  }
}
