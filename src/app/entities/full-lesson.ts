import {LessonPart} from './lesson-part';

export interface FullLesson {
  id: number;
  topicId: number;
  title: string;
  parts: Array<LessonPart>;
}
