import {SubmissionStatusStrings} from './submission-status';

export interface RunSubmission {
  id: string;
  problemId: number;
  status: SubmissionStatusStrings;
  maxExecutionTime: number;
  maxUsedMemory: number;
  errorString: string;
  solution: string;
  input: string;
  output: string;
}
