import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FakeGtagService} from '../../services/fake-gtag.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  email: string;
  sending: boolean;

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              private gtag: FakeGtagService) {
    this.sending = false;
  }

  ngOnInit() {
  }

  reset() {
    this.sending = true;
    this.authService.resetPassword(this.email).subscribe(() => {
      this.gtag.event('reset', {
        event_category: 'account'
      });
      this.sending = false;
      this.snackBar.open('На Вашу почту отправлено письмо с инструкциями.', undefined, {
        duration: 10000
      });
    }, () => {
      this.gtag.event('reset', {
        event_category: 'error-account'
      });
      this.sending = false;
      this.snackBar.open('Введен неверный email.', undefined, {
        duration: 5000
      });
    });
  }
}
