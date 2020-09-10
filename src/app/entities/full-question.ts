import {Answer} from './answer';

export interface FullQuestion {
  id: number;
  title: string;
  text: string;
  answers: Array<Answer>;
  multiple: boolean;
}
