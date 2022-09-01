import {Component, OnInit} from '@angular/core';
import {ConsultationService} from '../../services/consultation.service';
import {Consultation} from '../../entities/consultation';

@Component({
  selector: 'app-consultation-schedule',
  templateUrl: './consultation-schedule.component.html',
  styleUrls: ['./consultation-schedule.component.scss']
})
export class ConsultationScheduleComponent implements OnInit {
  consultation: Consultation;

  constructor(private consultationService: ConsultationService) {
  }

  ngOnInit(): void {
    this.consultationService.getConsultation().subscribe(consultation => {
      this.consultation = consultation;
    });
  }

  public toDate(source: string): Date {
    const time: string = source || '00:00:00';
    const date = new Date(`01-01-00 ${time}`);
    date.setHours(date.getHours() + 3);
    return date;
  }

  dayOfWeekAsString(dayOfWeek): string {
    if (dayOfWeek === 'MONDAY') {
      return 'Понедельник';
    } else if (dayOfWeek === 'TUESDAY') {
      return 'Вторник';
    } else if (dayOfWeek === 'WEDNESDAY') {
      return 'Среда';
    } else if (dayOfWeek === 'THURSDAY') {
      return 'Четверг';
    } else if (dayOfWeek === 'FRIDAY') {
      return 'Пятница';
    } else if (dayOfWeek === 'SATURDAY') {
      return 'Суббота';
    } else if (dayOfWeek === 'SUNDAY') {
      return 'Воскресенье';
    }
  }
}
