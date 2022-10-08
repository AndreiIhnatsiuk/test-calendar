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
import {AppointmentMeta} from '../../entities/calendar/appointment-meta';
import {MentorEventDialogComponent} from './event-dialog/event-dialog.component';
import {MentorAddEventDialogComponent} from './add-event-dialog/add-event-dialog.component';
import {AddSlotsDialogComponent} from './add-slots-dialog/add-slots-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup} from '@angular/forms';
import {SlotScheduleRequest} from '../../entities/calendar/slot-schedule-request';
import {SlotScheduleTime} from '../../entities/calendar/slot-schedule-time';
import {DateAdapter, NativeDateAdapter} from '@angular/material/core';

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

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
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
    },
    {provide: DateAdapter, useClass: CustomDateAdapter},
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mentor-calendar.component.html',
  styleUrls: ['./mentor-calendar.component.scss']
})
export class MentorCalendarComponent implements OnInit {
  viewDate = new Date();
  scheduleEvents: CalendarEvent[] = [];
  events: CalendarEvent[] = [];
  locale = 'ru';
  dragToCreateActive = false;
  weekStartsOn: 1 = 1;
  dialogRef: any;
  mentorId: number;
  isPlanningMode = false;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  slotScheduleTimes: SlotScheduleTime[] = [];

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
        const newEvent: CalendarEvent = {
          title: element.appointmentType.title + ' | ' + element.mentor.name + ' ' +
            this.datePipe.transform(element.startDate, 'HH:mm') + '-' + this.datePipe.transform(element.endDate, 'HH:mm'),
          start: new Date(element.startDate),
          end: new Date(element.endDate),
          color: {primary: 'rgb(63, 81, 181)', secondary: 'rgb(63, 81, 181)', secondaryText: 'white'},
          meta: new AppointmentMeta(
            element.appointmentType.title,
            element.description,
            element.conferenceLink,
            element.mentor.name + ' | ' + element.user.name,
            element.mentor.id,
            element.id
          ),
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
          end: addMinutes(new Date(element.startDate), 15),
          color: {primary: 'rgb(51, 182, 121)', secondary: 'rgb(51, 182, 121)', secondaryText: 'white'},
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
    if (event.meta instanceof AppointmentMeta) {
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
    const color1 = {primary: '#ead137', secondary: '#ead137', secondaryText: 'white'};
    const color2 = {primary: 'rgb(131,199,231)', secondary: 'rgb(131,199,231)', secondaryText: 'white'};
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New slots',
      color: this.isPlanningMode ? color1 : color2,
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    console.log(dragToSelectEvent);
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
        console.log(dragToSelectEvent);
        this.dialogRef = this.dialog
          .open(AddSlotsDialogComponent,
            {
              data:
                {
                  date: this.isPlanningMode ? this.datePipe.transform(dragToSelectEvent.start, 'EEEE').toUpperCase()
                    : this.datePipe.transform(dragToSelectEvent.start, 'yyyy-MM-dd'),
                  start: this.datePipe.transform(dragToSelectEvent.start, 'HH:mm'),
                  end: this.datePipe.transform(dragToSelectEvent.end, 'HH:mm'),
                  slotScheduleTimes: this.slotScheduleTimes,
                  isPlanningMode: this.isPlanningMode,
                  scheduleEvents: this.scheduleEvents,
                  currentEvent: dragToSelectEvent
                }
            });
        this.dialogRef.afterClosed().subscribe(() => {
          console.log(dragToSelectEvent);
          console.log(this.events);
          console.log(this.scheduleEvents);
          this.getAppointments();
          this.getSlots(this.mentorId);
          this.refresh();
        });
      });
  }

  switchPlanningMode() {
    this.isPlanningMode ? this.isPlanningMode = false : this.isPlanningMode = true;
  }

  createSchedule() {
    const slotScheduleRequest = new SlotScheduleRequest(new Date(this.range.value.start),
      new Date(this.range.value.end), this.slotScheduleTimes);
    this.slotService.createSchedule(slotScheduleRequest).subscribe(() => {
      this.snackBar.open('Отправлено', undefined, {
        duration: 10000
      });
    }, (err) => {
      this.snackBar.open(err.error.message, undefined, {
        duration: 10000
      });
    });
    this.isPlanningMode = false;
    this.scheduleEvents = [];
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}


