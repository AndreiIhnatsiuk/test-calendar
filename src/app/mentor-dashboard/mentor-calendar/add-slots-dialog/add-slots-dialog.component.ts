import {Component, Inject, OnInit} from '@angular/core';
import {SlotService} from '../../../services/calendar-service/slot.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppointmentService} from '../../../services/calendar-service/appointment.service';
import {AppointmentType} from '../../../entities/calendar/appointment-type';
import {SlotDto} from '../../../entities/calendar/slotDto';

class DialogData {
  date: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-add-slots-dialog',
  templateUrl: './add-slots-dialog.component.html',
  styleUrls: ['./add-slots-dialog.component.scss']
})
export class AddSlotsDialogComponent implements OnInit {
  appointmentTypeIds = [];
  appointmentTypes: AppointmentType[];
  allComplete = false;
  sending = false;

  constructor(private slotService: SlotService,
              private appointmentsService: AppointmentService,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<AddSlotsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    this.appointmentsService.getAppointmentTypes().subscribe(types => {
      this.appointmentTypes = types;
    });
  }

  createSlots(): void {
    this.sending = true;
    const slotDto = new SlotDto(this.data.date, this.data.start,
      this.data.end, this.appointmentTypeIds);
    this.slotService.set(slotDto).subscribe(() => {
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
  }

  deleteSlots() {
    this.sending = true;
    this.slotService.delete(this.data.date, this.data.start, this.data.end)
      .subscribe(() => {
        this.sending = false;
        this.snackBar.open('Слоты удалены', undefined, {
          duration: 10000
        });
      }, (err) => {
        this.sending = false;
        this.snackBar.open(err.error.message, undefined, {
          duration: 5000
        });
      });
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  addTypeId(id: number) {
    if (!this.appointmentTypeIds.includes(id)) {
      this.appointmentTypeIds.push(id);
    } else {
      this.appointmentTypeIds.splice(this.appointmentTypeIds.indexOf(id), 1);
    }
  }

  updateAllComplete() {
    this.allComplete = this.appointmentTypes.every(t => t.selected);
  }

  someComplete(): boolean {
    return this.appointmentTypes.filter(t => t.selected).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    this.appointmentTypes.forEach(t => (t.selected = completed));
    if (completed) {
      const x = [];
      this.appointmentTypes.forEach(y => x.push(y.id));
      this.appointmentTypeIds = x;
    } else {
      this.appointmentTypeIds = [];
    }
  }

  confirm(): void {
    if (confirm('Действительно хотите удалить слоты с ' + this.data.start + ' по ' + this.data.end + '?')) {
      this.deleteSlots();
    }
  }
}
