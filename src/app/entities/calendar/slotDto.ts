export class SlotDto {
  date: string;
  from: string;
  to: string;
  appointmentTypes: number[];


  constructor(date: string, from: string, to: string, appointmentTypes: number[]) {
    this.date = date;
    this.from = from;
    this.to = to;
    this.appointmentTypes = appointmentTypes;
  }
}
