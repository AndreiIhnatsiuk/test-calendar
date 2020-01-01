import {Test} from './test';

export interface FullTask {
  id: number;
  title: string;
  content: string;
  totalTests: string;
  tests: Array<Test>;
}
