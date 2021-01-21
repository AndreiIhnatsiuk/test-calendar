import {LessonPart} from './lesson-part';

export interface FullLesson {
  id: number;
  title: string;
  parts: Array<LessonPart>;
}
