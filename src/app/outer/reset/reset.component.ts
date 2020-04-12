import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  email: string;
  sending: boolean;

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar) {
    this.sending = false;
  }

  ngOnInit() {
  }

  reset() {
    this.sending = true;
    this.authService.resetPassword(this.email).subscribe(() => {
      this.sending = false;
      this.snackBar.open('На Вашу почту отправлено письмо с инструкциями.', undefined, {
        duration: 10000
      });
    }, () => {
      this.sending = false;
      this.snackBar.open('Введен неверный email.', undefined, {
        duration: 5000
      });
    });
  }
}
