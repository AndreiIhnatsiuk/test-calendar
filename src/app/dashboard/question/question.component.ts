import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UserAnswer} from '../../entities/user-answer';
import {ProblemService} from '../../services/problem.service';
import {FullProblem} from '../../entities/full-problem';
import {SubmissionService} from '../../services/submission.service';
import {BestLastUserAnswer} from '../../entities/best-last-user-answer';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionComponent implements OnInit {
  @Input() problemId: number;
  @Input() subtopicId: number;

  problem: FullProblem;
  userAnswer: UserAnswer = null;
  bestLastUserAnswer: BestLastUserAnswer;
  disabledButton = true;
  disabledCheckBox = false;
  sending = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private submissionService: SubmissionService,
              private problemService: ProblemService) {
  }

  onSelectAnswer() {
    this.disabledButton = this.problem.answers.findIndex(answer => answer.selected) === -1;
  }

  ngOnInit() {
    this.problemService.getProblemById(this.problemId).subscribe(fullProblem => {
      this.problem = fullProblem;
    });
    this.submissionService.getAnswerUser(this.problemId).subscribe(bestLastUserAnswer => {
      this.bestLastUserAnswer = bestLastUserAnswer;
      this.disabledCheckBox = bestLastUserAnswer.last !== null;
      this.userAnswer = bestLastUserAnswer.last;
      if (bestLastUserAnswer.last === null) {
        this.disabledButton = true;
      }
    });
  }

  send() {
    this.sending = true;
    const selectedAnswers = this.problem.answers
      .filter(answer => answer.selected)
      .map(answer => answer.id);
    this.submissionService.sendAnswerUser(this.problemId, selectedAnswers).subscribe(userAnswer => {
      if (this.bestLastUserAnswer.best === null || userAnswer.right) {
        this.bestLastUserAnswer.best = userAnswer;
      }
      this.bestLastUserAnswer.last = userAnswer;
      this.userAnswer = userAnswer;
      this.disabledCheckBox = true;
      this.sending = false;
    });
  }

  reset() {
    this.userAnswer = null;
    this.problem.answers.forEach(answer => answer.selected = false);
    this.disabledButton = true;
    this.disabledCheckBox = false;
  }
}
