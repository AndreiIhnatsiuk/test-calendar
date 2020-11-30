import {SubmissionStatusStrings} from './submission-status';

export interface Submission {
  id: string;
  problemId: number;
  status: SubmissionStatusStrings;
  wrongTest: number;
  maxExecutionTime: number;
  sentDate: string;
}
