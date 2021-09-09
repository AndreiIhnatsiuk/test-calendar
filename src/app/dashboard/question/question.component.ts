import {Component, Input, OnChanges, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UserAnswer} from '../../entities/user-answer';
import {ProblemService} from '../../services/problem.service';
import {FullProblem} from '../../entities/full-problem';
import {SubmissionService} from '../../services/submission.service';
import {BestLastUserAnswer} from '../../entities/best-last-user-answer';
import {Gtag} from 'angular-gtag';
import {ConfigurationService} from '../../services/configurations.service';
import {QuestionConfig} from '../../entities/question-config';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as routes from '../routes';
import {StoredAnswers} from '../../entities/stored-answers';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionComponent implements OnChanges {
  @Input() problemId: number;
  @Input() lessonId: number;
  @Input() moduleId: number;

  problem: FullProblem;
  userAnswer: UserAnswer = null;
  bestLastUserAnswer: BestLastUserAnswer;
  disabledButton = true;
  sending = false;
  config: QuestionConfig;
  seconds: number;
  urlToLesson: Array<any>;
  wasAcceptedAnswerAndPageWasNotReloaded: boolean;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private submissionService: SubmissionService,
              private problemService: ProblemService,
              private configurationService: ConfigurationService,
              private gtag: Gtag,
              private snackBar: MatSnackBar) {
  }

  onSelectAnswer() {
    this.disabledButton = this.problem.answers.findIndex(answer => answer.selected) === -1;
    const selectedAnswers = this.problem.answers
      .filter(answer => answer.selected)
      .map(answer => answer.id);
    const stored: StoredAnswers = {
      problemId: this.problemId,
      selectedAnswers: selectedAnswers
    };
    this.submissionService.storeSolution(stored);
  }

  ngOnChanges() {
    this.wasAcceptedAnswerAndPageWasNotReloaded = false;
    this.urlToLesson = ['/' + routes.DASHBOARD + '/' + routes.MODULE, this.moduleId, routes.LESSON, this.lessonId];
    this.configurationService.getConfiguration().subscribe(configuration => {
      this.config = configuration.questions;
    });
    this.problemService.getProblemById(this.problemId).subscribe(fullProblem => {
      this.problem = fullProblem;
      const stored = this.submissionService.getSolution<StoredAnswers>(this.problemId);
      if (stored) {
        const selectedAnswers = stored.selectedAnswers;
        this.disabledButton = selectedAnswers.length === 0;
        this.problem.answers.forEach(answer => {
          for (const selectedAnswer of selectedAnswers) {
            if (selectedAnswer === answer.id) {
              answer.selected = true;
            }
          }
        });
      } else {
        this.disabledButton = true;
      }
    });
    this.submissionService.getAnswerUser(this.problemId).subscribe(bestLastUserAnswer => {
      this.bestLastUserAnswer = bestLastUserAnswer;
      this.userAnswer = bestLastUserAnswer.last;
      if (bestLastUserAnswer.last === null) {
        const stored = this.submissionService.getSolution<StoredAnswers>(this.problemId);
        if (!stored || stored.selectedAnswers.length === 0) {
          this.disabledButton = true;
        }
        this.seconds = null;
      } else {
        this.calculateRemainingTimeForSecondAnswer();
      }
    });
  }

  send() {
    this.sending = true;
    const selectedAnswers = this.problem.answers
      .filter(answer => answer.selected)
      .map(answer => answer.id);
    this.submissionService.sendAnswerUser(this.problemId, selectedAnswers).subscribe(userAnswer => {
      this.gtag.event('answer', {
        event_category: 'question',
        event_label: '' + this.problemId
      });
      if (this.bestLastUserAnswer.best === null || userAnswer.right) {
        this.bestLastUserAnswer.best = userAnswer;
      }
      if (userAnswer.right) {
        this.wasAcceptedAnswerAndPageWasNotReloaded = true;
      }
      this.bestLastUserAnswer.last = userAnswer;
      this.calculateRemainingTimeForSecondAnswer();
      this.userAnswer = userAnswer;
      this.sending = false;
      this.submissionService.removeSolution(this.problemId);
      this.problem.answers.forEach(answer => answer.selected = false);
    }, error => {
      this.sending = false;
      this.snackBar.open(error.error.message, undefined, {
        duration: 5000
      });
    });
  }

  calculateRemainingTimeForSecondAnswer() {
    const time = (new Date().getTime() - new Date(this.bestLastUserAnswer.last.createdDate).getTime()) / 1000;
    this.seconds = Math.round(this.config.answerRateLimit - time);
    if (this.seconds <= 0) {
      this.seconds = null;
    }
  }

  onEvent($event) {
    if ($event.action === 'done') {
      this.seconds = null;
    }
  }

}
