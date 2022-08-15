import {Component, Input, NgZone, OnChanges, ViewChild} from '@angular/core';
import {FullProblem} from '../../entities/full-problem';
import {UserAnswer} from '../../entities/user-answer';
import {BestLastUserAnswer} from '../../entities/best-last-user-answer';
import {ProblemService} from '../../services/problem.service';
import {SubmissionService} from '../../services/submission.service';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Rating} from '../../entities/Rating';

@Component({
  selector: 'app-feedback-problem',
  templateUrl: './feedback-problem.component.html',
  styleUrls: ['./feedback-problem.component.scss']
})
export class FeedbackProblemComponent implements OnChanges {
  @Input() problemId: number;
  @Input() lessonId: number;
  @Input() type: string;
  UserFeedback: string;
  problem: FullProblem;
  disabledButton = false;
  wasAcceptedAnswerAndPageWasNotReloaded = false;
  userAnswer: UserAnswer = null;
  bestLastUserAnswer: BestLastUserAnswer;
  rating: Rating =
    {
      value: 1,
      max: 10,
      dense: true,
      color: 'primary'
    };

  constructor(
    private problemService: ProblemService,
    private submissionService: SubmissionService,
    private _ngZone: NgZone
  ) {
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  ngOnChanges() {
    this.problemService.getProblemById(this.problemId).subscribe(fullProblem => {
      this.problem = fullProblem;
    });
    this.submissionService.getAnswerUser(this.problemId).subscribe(bestLastUserAnswer => {
      this.bestLastUserAnswer = bestLastUserAnswer;
      this.userAnswer = bestLastUserAnswer.last;
    });
  }

  send() {
    this.submissionService.sendFeedback(this.problemId, this.rating.value, this.UserFeedback).subscribe(userAnswer => {
      if (this.bestLastUserAnswer.best === null || userAnswer.right) {
        this.bestLastUserAnswer.best = userAnswer;
      }
      if (userAnswer.right) {
        this.wasAcceptedAnswerAndPageWasNotReloaded = true;
      }
      this.bestLastUserAnswer.last = userAnswer;
      this.userAnswer = userAnswer;
      this.disabledButton = userAnswer.right;
    });
  }
}
