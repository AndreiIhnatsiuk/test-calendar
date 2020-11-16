import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {UserAgreementDialogComponent} from '../user-agreement-dialog/user-agreement-dialog.component';

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
              private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(UserAgreementDialogComponent, {
      width: '1000px',
    });
  }

  create() {
    this.sending = true;
    this.authService.create(this.name, this.email, this.password).subscribe(data => {
        this.sending = false;
    });
  }
}
