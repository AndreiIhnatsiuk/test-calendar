import {SubmissionStatusStrings} from './submission-status';
import {Test} from './test';
import {PullRequestInfo} from './pull-request-info';

export interface FullSubmission {
  id: string;
  problemId: number;
  status: SubmissionStatusStrings;
  errorString: string;
  wrongTest: number;
  test: Test;
  maxExecutionTime: number;
  maxUsedMemory: number;
  sentDate: string;
  solution: string;
  type: string;
  pullRequestInfo: PullRequestInfo;
}
