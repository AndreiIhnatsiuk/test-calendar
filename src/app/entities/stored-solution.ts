import {Stored} from './stored';

export interface StoredSolution extends Stored {
  solution: string;
  input: string;
  submissionId?: string;
}
