import {SubmissionStatusStrings} from './submission-status';
import {Test} from './test';

export interface FullSubmission {
  id: string;
  taskId: number;
  status: SubmissionStatusStrings;
  errorString: string;
  wrongTest: number;
  test: Test;
  maxExecutionTime: number;
  sentDate: string;
}
