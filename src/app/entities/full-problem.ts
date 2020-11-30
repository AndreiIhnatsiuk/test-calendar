import {Answer} from './answer';
import {Test} from './test';
import {Method} from './method';

export interface FullProblem {
  id: number;
  text: string;
  answers: Array<Answer>;
  multiple: boolean;
  totalTests: string;
  tests: Array<Test>;
  method: Method;
  hintsCount: number;
}
