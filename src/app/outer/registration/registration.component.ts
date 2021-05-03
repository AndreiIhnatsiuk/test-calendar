import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {UserAgreementDialogComponent} from '../user-agreement-dialog/user-agreement-dialog.component';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Gtag} from 'angular-gtag';

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
  offerNotification = false;

  constructor(public dialog: MatDialog,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              private gtag: Gtag) {
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.gtag.event('open', {
      event_category: 'user-agreement',
      event_label: 'signup-page'
    });
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
    this.authService.create(this.name, this.email, this.password, this.offerNotification).subscribe(() => {
        this.authService.login(this.email, this.password).subscribe(() => {
          this.gtag.event('signup', {
            event_category: 'account'
          });
          this.router.navigate(['/dashboard']);
        }, () => {
          this.gtag.event('signup', {
            event_category: 'error-account'
          });
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
