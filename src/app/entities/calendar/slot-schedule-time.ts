export class SlotScheduleTime {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  appointmentTypes: number[];

  constructor(dayOfWeek: string, startTime: string, endTime: string, appointmentTypes: number[]) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.appointmentTypes = appointmentTypes;
  }
}
