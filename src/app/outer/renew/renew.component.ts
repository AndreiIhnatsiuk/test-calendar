import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-renew',
  templateUrl: './renew.component.html',
  styleUrls: ['./renew.component.scss']
})
export class RenewComponent implements OnInit {
  password: string;
  password2: string;
  sending: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute) {
    this.sending = false;
  }

  ngOnInit() {
  }

  renew() {
    if (this.password !== this.password2) {
      this.snackBar.open('Введеные пароли не совпадают.', undefined, {
        duration: 5000
      });
      return;
    }
    this.sending = true;
    this.authService.updatePassword(this.route.snapshot.paramMap.get('id'), this.password).subscribe(() => {
      this.snackBar.open('Пароль изменен.', undefined, {
        duration: 5000
      });
      this.router.navigate(['/dashboard']);
    }, (e) => {
      this.snackBar.open(e.error.message + ' Минимальная длина пароля 7 символов', undefined, {
        duration: 5000
      });
      this.sending = false;
    });
  }
}
