import {Subtopic} from './subtopic';

export interface Chapter {
  id: number;
  name: string;
  subtopics: Array<Subtopic>;
}
