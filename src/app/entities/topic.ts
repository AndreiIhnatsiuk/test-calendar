import {Lesson} from './lesson';

export interface Topic {
  id: number;
  name: string;
  lessons: Array<Lesson>;
}
