import {Stored} from './stored';

export interface StoredAnswers extends Stored {
  selectedAnswers: Array<number>;
}
