import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {FullProblem} from '../../entities/full-problem';
import {ProblemService} from '../../services/problem.service';
import {SubmissionService} from '../../services/submission.service';
import {ActivatedRoute} from '@angular/router';
import {UserAnswer} from '../../entities/user-answer';
import {BestLastUserAnswer} from '../../entities/best-last-user-answer';
import {ConfigurationService} from '../../services/configurations.service';
import {QuestionConfig} from '../../entities/question-config';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {zip} from 'rxjs';
import {FakeGtagService} from '../../services/fake-gtag.service';

@Component({
  selector: 'app-input-question',
  templateUrl: './input-question.component.html',
  styleUrls: ['./input-question.component.scss']
})
export class InputQuestionComponent implements OnChanges {
  @Input() problemId: number;
  @Input() lessonId: number;
  @Input() moduleId: number;
  problem: FullProblem;
  wasAcceptedAnswerAndPageWasNotReloaded: boolean;
  userAnswer: UserAnswer = null;
  bestLastUserAnswer: BestLastUserAnswer;
  seconds: number;
  config: QuestionConfig;
  InputQuestionUserAnswer: any;


  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private submissionService: SubmissionService,
    private configurationService: ConfigurationService,
    private gtag: FakeGtagService
  ) {
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  send(): void {
    this.submissionService.sendAnswerForInputQuestion(this.problemId, this.InputQuestionUserAnswer).subscribe(userAnswer => {
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
    });
  }

  ngOnChanges() {
    zip(
      this.configurationService.getConfiguration(),
      this.problemService.getProblemById(this.problemId),
      this.submissionService.getAnswerUser(this.problemId)
    ).subscribe(([configuration, fullProblem, bestLastUserAnswer]) => {
      this.config = configuration.questions;
      this.problem = fullProblem;
      this.bestLastUserAnswer = bestLastUserAnswer;
      this.userAnswer = bestLastUserAnswer.last;
      if (bestLastUserAnswer.last === null) {
        this.seconds = null;
      } else {
        this.calculateRemainingTimeForSecondAnswer();
      }
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
