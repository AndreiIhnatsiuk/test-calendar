import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CalendarEvent} from 'angular-calendar';
import {AddEventDialogComponent} from '../add-event-dialog/add-event-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppointmentService} from '../../../services/calendar-service/appointment.service';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent {
  dialogPatch: any;

  constructor(private dialogRef: MatDialogRef<EventDialogComponent>,
              private dialog: MatDialog,
              private appointmentService: AppointmentService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public event: CalendarEvent) {
  }

  confirm(id: number): void {
    if (confirm('Действительно хотите удалить?')) {
      this.delete(id);
    }
  }

  delete(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      this.snackBar.open('Удалено', undefined, {
        duration: 10000
      });
    }, (err) => {
      this.snackBar.open(err.error.message, undefined, {
        duration: 5000
      });
    });
    this.dialogRef.close();
  }

  usePatchDialog() {
    this.dialogPatch = this.dialog.open(AddEventDialogComponent, {data: {event: this.event, mentorId: null, dialog: this.dialogRef}});
  }
}
