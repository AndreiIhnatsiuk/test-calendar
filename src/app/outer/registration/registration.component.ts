import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {UserAgreementDialogComponent} from '../user-agreement-dialog/user-agreement-dialog.component';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  sending: boolean;

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(UserAgreementDialogComponent, {
      width: '1000px',
    });
  }

  create() {
    if (this.password.length < 7) {
      this.snackBar.open('Минимальная длина пароля 7 символов.', undefined, {
        duration: 5000
      });
      return;
    }
    this.sending = true;
    this.authService.create(this.name, this.email, this.password).subscribe(() => {
        this.authService.login(this.email, this.password).subscribe(() => {
          this.router.navigate(['/dashboard']);
        }, () => {
          this.sending = false;
        });
        this.snackBar.open('Регистрация завершена. Приятного обучения.', undefined, {
          duration: 5000
        });
        this.password = '';
    }, error => {
      this.snackBar.open(error.error.message, undefined, {
        duration: 5000
      });
      this.sending = false;
    });
  }
}
