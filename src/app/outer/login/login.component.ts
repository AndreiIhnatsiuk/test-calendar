import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Gtag} from 'angular-gtag';

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
              private snackBar: MatSnackBar,
              private gtag: Gtag) {
    this.sending = false;
  }

  ngOnInit() {
  }

  login() {
    // this.sending = true;
    // this.authService.login(this.email, this.password).subscribe(() => {
    //   this.gtag.event('login', {
    //     event_category: 'account'
    //   });
    //   this.router.navigate(['/dashboard']);
    // }, () => {
    //   this.gtag.event('login', {
    //     event_category: 'error-account'
    //   });
    //   this.sending = false;
    //   this.snackBar.open('Логин или пароль введены не верно.', undefined, {
    //     duration: 5000
    //   });
    // });
  }
}
