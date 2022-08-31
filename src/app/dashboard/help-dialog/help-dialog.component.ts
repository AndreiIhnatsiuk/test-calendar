import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ModuleService} from 'src/app/services/module.service';
import {ConsultationService} from '../../services/consultation.service';
import {Consultation} from '../../entities/consultation';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss']
})
export class HelpDialogComponent implements OnInit {
  isOpen: boolean;
  isAvailableSecondModule: boolean;
  consultation: Consultation;

  constructor(private moduleService: ModuleService,
              private consultationService: ConsultationService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.moduleService.getAvailableModules().subscribe(modules => {
      if (modules.size > 1) {
        this.isAvailableSecondModule = true;
      }
    });
    this.consultationService.getConsultation().subscribe(consultation => {
      this.consultation = consultation;
    });
  }

  openGoogleCalendarInNewTab() {
    if (this.isAvailableSecondModule) {
      window.open('https://calendar.google.com/calendar/u/0/r', '_blank');
    } else {
      this.snackBar.open('Доступно со второго модуля', undefined, {
        duration: 5000
      });
    }
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
