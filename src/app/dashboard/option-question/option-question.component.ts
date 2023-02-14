import {Component, HostListener, Input, OnChanges, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
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
import {QuestionPageAreas} from '../../entities/question-page-areas';
import {LocalStorageService} from '../../services/local-storage.service';
import {zip} from 'rxjs';

@Component({
  selector: 'app-option-question',
  templateUrl: './option-question.component.html',
  styleUrls: ['./option-question.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OptionQuestionComponent implements OnChanges, OnDestroy {
  @Input() problemId: number;
  @Input() lessonId: number;
  @Input() moduleId: number;

  questionPageAreas: QuestionPageAreas = new QuestionPageAreas();
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
              private snackBar: MatSnackBar,
              private localStorage: LocalStorageService) {
    const questionPageAreas: string = localStorage.getItem('questionPageAreas');
    if (questionPageAreas) {
      this.questionPageAreas = JSON.parse(questionPageAreas);
      if (!this.questionPageAreas.question) {
        this.questionPageAreas.question = 50;
        this.questionPageAreas.answers = 50;
      }
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler() {
    this.localStorage.setItem('questionPageAreas', JSON.stringify(this.questionPageAreas));
  }

  dragEndWindow(unit, {sizes}) {
    this.questionPageAreas.question = sizes[0];
    this.questionPageAreas.answers = sizes[1];
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

  ngOnDestroy(): void {
    this.localStorage.setItem('questionPageAreas', JSON.stringify(this.questionPageAreas));
  }

  ngOnChanges() {
    this.wasAcceptedAnswerAndPageWasNotReloaded = false;
    this.urlToLesson = ['/' + routes.DASHBOARD + '/' + routes.MODULE, this.moduleId, routes.LESSON, this.lessonId];
    zip(
      this.configurationService.getConfiguration(),
      this.problemService.getProblemById(this.problemId),
      this.submissionService.getAnswerUser(this.problemId)
    ).subscribe(([configuration, fullProblem, bestLastUserAnswer]) => {
      this.config = configuration.questions;
      this.problem = fullProblem;
      this.bestLastUserAnswer = bestLastUserAnswer;
      this.userAnswer = bestLastUserAnswer.last;
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
      if (bestLastUserAnswer.last === null) {
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
