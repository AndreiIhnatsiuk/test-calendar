import {Component, Inject, OnInit} from '@angular/core';
import {SlotService} from '../../../services/calendar-service/slot.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SlotRequest} from '../../../entities/calendar/slot-request';
import {CalendarEvent} from 'angular-calendar';

class DialogData {
  date: string;
  start: string;
  end: string;
  isPlanningMode: boolean;
  scheduleEvents: CalendarEvent[];
  currentEvent: CalendarEvent;
}

@Component({
  selector: 'app-add-slots-dialog',
  templateUrl: './add-slots-dialog.component.html',
  styleUrls: ['./add-slots-dialog.component.scss']
})
export class AddSlotsDialogComponent implements OnInit {
  appointmentTypeIds = [];
  sending = false;

  constructor(private slotService: SlotService,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<AddSlotsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
  }

  createSlots(): void {
    console.log(this.appointmentTypeIds);
    this.sending = true;
    const slotDto = new SlotRequest(this.data.date, this.data.start,
      this.data.end, this.appointmentTypeIds);
    this.slotService.createSlots(slotDto).subscribe(() => {
      this.sending = false;
      this.snackBar.open('Слоты созданы успешно', undefined, {
        duration: 10000
      });
    }, (err) => {
      this.sending = false;
      this.snackBar.open(err.error.message, undefined, {
        duration: 10000
      });
    });
    this.close();
    console.log(this.appointmentTypeIds);
  }

  deleteSlots() {
    this.sending = true;
    this.slotService.deleteSlots(this.data.date, this.data.start, this.data.end)
      .subscribe({
        next: () => {
          this.sending = false;
          this.snackBar.open('Слоты удалены', undefined, {
            duration: 10000
          });
        },
        error: (err) => {
          this.sending = false;
          this.snackBar.open(err.error.message, undefined, {
            duration: 5000
          });
        },
      });
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (confirm('Действительно хотите удалить слоты с ' + this.data.start + ' по ' + this.data.end + '?')) {
      this.deleteSlots();
    }
  }

  addSlotScheduleTimes(): void {
    this.data.currentEvent.meta = {appointmentTypes: this.appointmentTypeIds};
    this.data.scheduleEvents.push(this.data.currentEvent);
    this.dialogRef.close();
  }
}
