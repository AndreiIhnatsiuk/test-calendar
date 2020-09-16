import {Test} from './test';
import {Method} from './method';

export interface FullTask {
  id: number;
  title: string;
  content: string;
  totalTests: string;
  tests: Array<Test>;
  method: Method;
  hintsCount: number;
}
