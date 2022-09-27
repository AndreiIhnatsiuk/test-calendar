import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, OnInit, ViewEncapsulation} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent, CalendarEventTitleFormatter, DateFormatterParams} from 'angular-calendar';
import {DatePipe, formatDate} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {EventDialogComponent} from './event-dialog/event-dialog.component';
import {AddEventDialogComponent} from './add-event-dialog/add-event-dialog.component';
import {Mentor} from '../../entities/mentor';
import {AppointmentService} from '../../services/calendar-service/appointment.service';
import {SlotService} from '../../services/calendar-service/slot.service';
import {MentorService} from '../../services/mentor.service';
import {EventMeta} from '../../entities/calendar/event-meta';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  public dayViewHour({date, locale}: DateFormatterParams): string {
    return formatDate(date, 'HH:mm', locale);
  }

  public weekViewTitle({date, locale}: DateFormatterParams): string {
    return formatDate(date, 'LLLL y', locale);
  }

  public weekViewColumnHeader({date, locale}: DateFormatterParams): string {
    return formatDate(date, 'EEEEEE', locale);
  }

  public weekViewColumnSubHeader({date, locale}: DateFormatterParams): string {
    return formatDate(date, 'd', locale);
  }
}

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  viewDate = new Date();
  events: CalendarEvent[] = [];
  locale = 'ru';
  weekStartsOn: 1 = 1;
  dialogRef: any;
  mentors: Mentor[];
  chosenMentorId: number;


  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private mentorService: MentorService,
              private datePipe: DatePipe,
              private slotService: SlotService,
              private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.getAppointments();
    this.mentorService.get(1).subscribe(mentors => {
      this.mentors = mentors;
    });
  }

  getAppointments() {
    this.appointmentService.getAppointments().subscribe(data => {
      const newEvents: CalendarEvent[] = [];
      data.forEach(element => {
        const newEvent: CalendarEvent<EventMeta> = {
          title: element.appointmentType.title + ' | ' + element.mentor.name + ' ' +
            this.datePipe.transform(element.startDate, 'HH:mm') + '-' + this.datePipe.transform(element.endDate, 'HH:mm'),
          start: new Date(element.startDate),
          end: new Date(element.endDate),
          color: {primary: 'rgb(63, 81, 181)', secondary: 'rgb(63, 81, 181)', secondaryText: 'white'},
          meta: {
            eventTitle: element.appointmentType.title,
            eventDescription: element.description,
            eventConferenceLink: element.conferenceLink,
            eventParticipants: element.mentor.name + ' | ' + element.user.name,
            mentorId: element.mentor.id,
            appointmentId: element.id
          } as EventMeta,
        };
        newEvents.push(newEvent);
      });
      this.events = newEvents;
      this.refresh();
    });
  }

  getSlots(mentorId: number) {
    this.getAppointments();
    this.slotService.get(mentorId).subscribe(slots => {
      const slotsEvent: CalendarEvent[] = [];
      slots.forEach(element => {
        const newEvent: CalendarEvent = {
          title: '',
          start: new Date(element.startDate),
          end: new Date(new Date(element.startDate).getTime() + 15 * 60000),
          color: {primary: '#51ab86', secondary: '#51ab86', secondaryText: 'white'},
        };
        slotsEvent.push(newEvent);
      });
      this.events = [...this.events].concat(slotsEvent);
      this.refresh();
    });
  }

  useDialog(event: CalendarEvent) {
    this.dialogRef = this.dialog.open(EventDialogComponent, {data: event});
    this.dialogRef.afterClosed().subscribe(() => {
      this.chosenMentorId === undefined ? this.getAppointments() : this.getSlots(this.chosenMentorId);
    });
  }

  eventClicked({event}: { event: CalendarEvent }): void {
    if (event.meta !== undefined) {
      this.useDialog(event);
    } else {
      this.addEvent(event);
    }
  }

  addEvent(event: CalendarEvent): void {
    this.dialogRef = this.dialog.open(AddEventDialogComponent, {data: {event: event, mentorId: this.chosenMentorId}});
    this.dialogRef.afterClosed().subscribe(() => {
      this.chosenMentorId === undefined ? this.getAppointments() : this.getSlots(this.chosenMentorId);
    });
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}


