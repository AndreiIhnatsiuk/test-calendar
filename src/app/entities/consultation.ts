import {TimeTable} from './time-table';

export interface Consultation {
  title: string;
  conferenceLink: string;
  schedule: Array<TimeTable>;
}
