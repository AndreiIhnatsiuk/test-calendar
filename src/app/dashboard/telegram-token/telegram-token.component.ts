import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TelegramToken} from '../../entities/telegram-token';
import {AuthService} from '../../auth/auth.service';
import {interval, Subscription} from 'rxjs';
import {TelegramService} from '../../services/telegram.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-telegram-token',
  templateUrl: './telegram-token.component.html',
  styleUrls: ['./telegram-token.component.scss']
})
export class TelegramTokenComponent implements OnInit, OnDestroy {

  telegramTokenLifetime: number;
  sending: boolean;
  private intervalSub: Subscription;

  constructor(private authService: AuthService,
              private dialogRef: MatDialogRef<TelegramTokenComponent>,
              private telegramService: TelegramService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public token: TelegramToken) {
  }

  ngOnInit(): void {
    this.calculateTokenLifetime();
    this.intervalSub = interval(5000).subscribe(() => {
      this.checkBinding();
    });
  }

  checkBinding() {
    this.authService.getMe().subscribe((personal) => {
      if (personal.telegramUsername != null) {
        this.close();
      }
    });
  }

  close(): void {
    this.snackBar.open('Привязка успешно завершена', undefined, {
      duration: 10000
    });
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.intervalSub.unsubscribe();
  }

  onEvent($event) {
    if ($event.action === 'done') {
      this.telegramTokenLifetime = null;
    }
  }

  calculateTokenLifetime() {
    this.telegramTokenLifetime = (new Date(this.token.expiredDate).getTime() - new Date().getTime()) / 1000;
  }

  requestTokenAgain() {
    this.sending = true;
    this.telegramService.bindTelegram().subscribe((token) => {
      this.sending = false;
      this.token = token;
      this.calculateTokenLifetime();
    }, (err) => {
      this.sending = false;
      this.snackBar.open(err.error.message, undefined, {
        duration: 5000
      });
    });
  }

}
