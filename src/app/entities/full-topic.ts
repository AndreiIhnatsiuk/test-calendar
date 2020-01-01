import {TopicPart} from './topic-part';

export interface FullTopic {
  id: number;
  title: string;
  parts: Array<TopicPart>;
}
