import {Component, Input, OnChanges} from '@angular/core';
import {FullProblem} from '../../entities/full-problem';
import {ProblemService} from '../../services/problem.service';
import {SubmissionService} from '../../services/submission.service';
import {UserAnswer} from '../../entities/user-answer';
import {BestLastUserAnswer} from '../../entities/best-last-user-answer';

@Component({
  selector: 'app-theory',
  templateUrl: './theory.component.html',
  styleUrls: ['./theory.component.scss']
})
export class TheoryComponent implements OnChanges {
  @Input() problemId: number;
  @Input() lessonId: number;
  @Input() type: string;
  problem: FullProblem;
  disabledButton = false;
  wasAcceptedAnswerAndPageWasNotReloaded = false;
  userAnswer: UserAnswer = null;
  bestLastUserAnswer: BestLastUserAnswer;

  constructor(
    private problemService: ProblemService,
    private submissionService: SubmissionService
  ) {
  }

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
    this.submissionService.confirmTheory(this.problemId).subscribe(userAnswer => {
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
