import {Lesson} from './lesson';

export interface Topic {
  id: number;
  moduleId: number;
  name: string;
  lessons: Array<Lesson>;
}
