import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  sending: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.sending = false;
  }

  ngOnInit() {
  }

  login() {
    this.sending = true;
    this.authService.login(this.email, this.password, () => {
      this.router.navigate(['/dashboard']);
    }, () => {
      this.sending = false;
      this.snackBar.open('Логин или пароль введены не верно.', undefined, {
        duration: 5000
      });
    });
  }
}
