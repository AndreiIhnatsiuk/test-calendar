import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FullQuestion} from '../../entities/full-question';
import {QuestionService} from '../../services/question.service';
import {AuthService} from '../../services/auth.service';
import {UserAnswer} from '../../entities/user-answer';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionComponent implements OnInit {
  questionId: number;
  question: FullQuestion;
  userAnswer: UserAnswer = null;
  disabledButton = true;
  disabledCheckBox = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private questionService: QuestionService) {
  }

  onSelectAnswer() {
    this.disabledButton = this.question.answers.findIndex(answer => answer.selected) === -1;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.questionId = +map.get('questionId');
      this.questionService.getQuestionById(this.questionId).subscribe(fullQuestion => {
        this.question = fullQuestion;
      });
      this.questionService.getAnswerUser(this.questionId).subscribe(userAnswer => {
        this.disabledCheckBox = userAnswer !== null;
        this.userAnswer = userAnswer;
        this.disabledButton = false;
      });
    });
  }

  send() {
    this.disabledButton = true;
    const selectedAnswers = this.question.answers
      .filter(answer => answer.selected)
      .map(answer => answer.id);
    this.questionService.sendAnswerUser(this.questionId, selectedAnswers).subscribe(userAnswer => {
      this.userAnswer = userAnswer;
      this.disabledButton = false;
      this.disabledCheckBox = true;
    });
  }

  reset() {
    this.userAnswer = null;
    this.question.answers.forEach(answer => answer.selected = false);
    this.disabledButton = true;
    this.disabledCheckBox = false;
  }
}
