export class AppointmentRequest {
  mentorId: number;
  appointmentTypeId: number;
  description: string;
  startDate: Date;

  constructor(mentorId: number, appointmentTypeId: number, description: string, startDate: Date) {
    this.mentorId = mentorId;
    this.appointmentTypeId = appointmentTypeId;
    this.description = description;
    this.startDate = startDate;
  }
}
