import {Component, OnInit} from '@angular/core';
import {Personal} from '../../entities/personal';
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  personal: Personal;
  phone: string;
  repository: string;
  sending: boolean;

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.authService.getMe().subscribe(personal => {
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
}
