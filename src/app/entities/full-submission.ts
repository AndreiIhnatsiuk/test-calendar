import {SubmissionStatusStrings} from './submission-status';
import {Test} from './test';

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
}
