import {SubmissionStatus} from './submission-status';

export interface Submission {
  id: string;
  taskId: number;
  status: SubmissionStatus;
  wrongTest: number;
  maxExecutionTime: number;
  sentDate: string;
}
