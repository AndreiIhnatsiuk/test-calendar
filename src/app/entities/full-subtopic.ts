import {SubtopicPart} from './subtopic-part';

export interface FullSubtopic {
  id: number;
  title: string;
  parts: Array<SubtopicPart>;
}
