import {Subtopic} from './subtopic';

export interface Topic {
  id: number;
  name: string;
  subtopics: Array<Subtopic>;
}
