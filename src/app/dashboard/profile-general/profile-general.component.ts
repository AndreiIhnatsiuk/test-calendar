import {Component, OnInit} from '@angular/core';
import {Personal} from '../../entities/personal';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TelegramService} from '../../services/telegram.service';
import {TelegramToken} from '../../entities/telegram-token';
import {MatDialog} from '@angular/material/dialog';
import {TelegramTokenComponent} from '../telegram-token/telegram-token.component';

@Component({
  selector: 'app-profile-general',
  templateUrl: './profile-general.component.html',
  styleUrls: ['./profile-general.component.scss']
})
export class ProfileGeneralComponent implements OnInit {
  personal: Personal;
  phone: string;
  repository: string;
  sending: boolean;
  bindingTelegram: boolean;
  sendingEmail: boolean;
  token: TelegramToken;
  dialogRef: any;

  constructor(private authService: AuthService,
              private telegramService: TelegramService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getPersonal();
  }

  getPersonal() {
    this.authService.getMe().subscribe((personal) => {
      this.personal = personal;
    });
  }

  send() {
    this.sending = true;
    this.authService.updatePersonal(this.phone, this.repository, this.personal.emailNotifications)
      .subscribe(personal => {
        this.sending = false;
        this.repository = null;
        this.phone = null;
        this.personal = personal;
        this.snackBar.open('Сохранено', undefined, {
          duration: 5000
        });
      }, error => {
        this.sending = false;
        let message = error.error.message;
        if (message === 'Ошибка. Проверьте введенные данные.') {
          message = 'Телефон должен быть в формате: +375 25 xxx-xx-xx, +375 29 xxx-xx-xx, +375 33 xxx-xx-xx или +375 44 xxx-xx-xx';
        }
        this.snackBar.open(message, undefined, {
          duration: 10000
        });
      });
  }

  confirmEmail() {
    this.sendingEmail = true;
    this.authService.requestMailConfirmation().subscribe((() => {
      this.sendingEmail = false;
      this.snackBar.open('На Вашу почту отправлено письмо с инструкциями.', undefined, {
        duration: 10000
      });
    }), e => {
      this.sendingEmail = false;
      this.snackBar.open(e.error.message, undefined, {
        duration: 10000
      });
    });
  }

  useDialog() {
    this.dialogRef = this.dialog.open(TelegramTokenComponent, {data: this.token});
    this.dialogRef.afterClosed().subscribe(() => this.getPersonal());
  }

  telegramBinding() {
    this.bindingTelegram = true;
    if (this.token === undefined || (new Date().getTime() > new Date(this.token.expiredDate).getTime())) {
      this.telegramService.bindTelegram().subscribe((token) => {
        this.bindingTelegram = false;
        this.token = token;
        this.useDialog();
      }, (err) => {
        this.bindingTelegram = false;
        this.snackBar.open(err.error.message, undefined, {
          duration: 5000
        });
      });
    } else {
      this.bindingTelegram = false;
      this.useDialog();
    }
  }

}
