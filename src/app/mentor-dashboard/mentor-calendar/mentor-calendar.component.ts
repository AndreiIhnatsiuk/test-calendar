import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, OnInit, ViewEncapsulation} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent, CalendarEventTitleFormatter, DateFormatterParams} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';
import {fromEvent} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {addDays, addMinutes, endOfWeek} from 'date-fns';
import {DatePipe, formatDate} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {AppointmentService} from '../../services/calendar-service/appointment.service';
import {SlotService} from '../../services/calendar-service/slot.service';
import {EventMeta} from '../../entities/calendar/event-meta';
import {MentorEventDialogComponent} from './event-dialog/event-dialog.component';
import {MentorAddEventDialogComponent} from './add-event-dialog/add-event-dialog.component';
import {AddSlotsDialogComponent} from './add-slots-dialog/add-slots-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../services/auth.service';

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

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
  templateUrl: './mentor-calendar.component.html',
  styleUrls: ['./mentor-calendar.component.scss']
})
export class MentorCalendarComponent implements OnInit {
  viewDate = new Date();
  events: CalendarEvent[] = [];
  scheduleEvents: CalendarEvent[] = [];
  locale = 'ru';
  dragToCreateActive = false;
  weekStartsOn: 1 = 1;
  dialogRef: any;
  mentorId: number;

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private slotService: SlotService,
              private datePipe: DatePipe,
              private authService: AuthService,
              private appointmentService: AppointmentService) {
  }

  ngOnInit() {
    this.getAppointments();
    this.authService.getMe().subscribe((me) => {
      this.mentorId = me.id;
      this.getSlots(me.id);
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
    this.dialogRef = this.dialog.open(MentorEventDialogComponent, {data: event});
    this.dialogRef.afterClosed().subscribe(() => {
      this.refresh();
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
    this.dialogRef = this.dialog.open(MentorAddEventDialogComponent, {data: {event: event, mentorId: this.mentorId}});
    this.dialogRef.afterClosed().subscribe(() => {
      this.refresh();
    });
  }

  startDragToCreate(segment: WeekViewHourSegment, mouseDownEvent: MouseEvent, segmentElement: HTMLElement) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New slots',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refresh();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          15
        );
        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh();
      }, null, () => {
        if (dragToSelectEvent.end === undefined) {
          dragToSelectEvent.end = addMinutes(dragToSelectEvent.start, 15);
        }
        const startedDate = this.datePipe.transform(dragToSelectEvent.start, 'yyyy-MM-dd');
        const startedTime = this.datePipe.transform(dragToSelectEvent.start, 'HH:mm');
        const endedTime = this.datePipe.transform(dragToSelectEvent.end, 'HH:mm');
        this.dialogRef = this.dialog
          .open(AddSlotsDialogComponent, {data: {date: startedDate, start: startedTime, end: endedTime}});
        this.dialogRef.afterClosed().subscribe(() => {
          this.getAppointments();
          this.getSlots(this.mentorId);
          this.refresh();
        });
      });
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}


