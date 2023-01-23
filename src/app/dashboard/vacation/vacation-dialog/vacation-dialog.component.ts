import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';
import {VacationRequest} from '../../../entities/vacation/vacation-request';
import {VacationService} from '../../../services/vacation/vacation-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-vacation-dialog',
  templateUrl: './vacation-dialog.component.html',
  styleUrls: ['./vacation-dialog.component.scss']
})
export class VacationDialogComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private vacationService: VacationService,
              private snackBar: MatSnackBar,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.range.setValue({start: this.data.startDate, end: this.data.endDate});
    }
  }

  submit(id?: number) {
    const startDate = this.datePipe.transform(new Date(this.range.value.start), 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(new Date(this.range.value.end), 'yyyy-MM-dd');
    const vacationRequest = new VacationRequest(startDate, endDate);
    if (id) {
      this.vacationService.updateVacation(id, vacationRequest).subscribe({
        next: () => {
          this.snackBar.open('Отпуск изменен', undefined, {
            duration: 10000
          });
        },
        error: (err) => {
          this.snackBar.open(err.error.message, undefined, {
            duration: 10000
          });
        }
      });
    } else {
      this.vacationService.createVacation(1, vacationRequest).subscribe({  // TODO courseId hardcode
        next: () => {
          this.snackBar.open('Отпуск создан', undefined, {
            duration: 10000
          });
        },
        error: (err) => {
          this.snackBar.open(err.error.message, undefined, {
            duration: 10000
          });
        }
      });
    }
  }
}
