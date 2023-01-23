import {Component, OnInit} from '@angular/core';
import {VacationService} from '../../services/vacation/vacation-service';
import {MatDialog} from '@angular/material/dialog';
import {Vacation} from '../../entities/vacation/vacation';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VacationDialogComponent} from './vacation-dialog/vacation-dialog.component';
import {differenceInDays} from 'date-fns';

@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.scss']
})
export class VacationComponent implements OnInit {
  vacations: Array<Vacation>;
  weekDaysLeft: string;
  singleDaysLeft: string;
  dialogRef: any;
  today: Date = new Date;

  constructor(private vacationService: VacationService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getAllVacations();
    this.getVacationDays();
  }

  getAllVacations() {
    this.vacationService.getAllVacations(1).subscribe(vacations => { // TODO Replace a courseId hardcode
      this.vacations = vacations.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    });
  }

  getVacationDays() {
    this.vacationService.getVacationsDays(1).subscribe(days => {  // TODO Replace a courseId hardcode
      this.singleDaysLeft = days.singleDaysLeft + ' ' + this.createDaysLabel(days.singleDaysLeft);
      this.weekDaysLeft = days.weekDaysLeft + ' ' + this.createDaysLabel(days.weekDaysLeft);
    });
  }

  createDaysLabel(number) {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['день', 'дня', 'дней'];
    return `${titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]]}`;
  }

  parseDate(date: Date) {
    return new Date(date).getTime();
  }

  countLeftDays(endDate: Date) {
    const leftDays = differenceInDays(new Date(endDate), this.today);
    return leftDays + ' ' + this.createDaysLabel(leftDays);
  }

  confirm(id: number) {
    if (confirm('Действительно хотите удалить отпуск?')) {
      this.delete(id);
    }
  }

  useDialog(id?: number, startDate?: Date, endDate?: Date) {
    this.dialogRef = this.dialog.open(VacationDialogComponent, {
      disableClose: true,
      height: '250px',
      width: '300px',
      data: {id: id, startDate: startDate, endDate: endDate}
    });
    this.dialogRef.afterClosed().subscribe({
      complete: () => {
        this.getAllVacations();
        this.getVacationDays();
      }
    });
  }

  delete(id: number) {
    this.vacationService.deleteVacation(id).subscribe(() => {
      this.snackBar.open('Удалено', undefined, {
        duration: 10000
      });
    }, (err) => {
      this.snackBar.open(err.error.message, undefined, {
        duration: 5000
      });
    }, () => {
      this.getAllVacations();
      this.getVacationDays();
    });
  }
}
