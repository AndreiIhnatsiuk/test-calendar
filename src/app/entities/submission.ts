import {SubmissionStatusStrings} from './submission-status';

export interface Submission {
  id: string;
  taskId: number;
  status: SubmissionStatusStrings;
  wrongTest: number;
  maxExecutionTime: number;
  sentDate: string;
}
