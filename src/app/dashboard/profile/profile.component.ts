import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Personal} from '../../entities/personal';
import {AuthService} from '../../services/auth.service';
import {Gtag} from 'angular-gtag';
import {error} from '@angular/compiler/src/util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  personal: Personal;
  phone: string;
  repository: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getMe().subscribe(personal => {
      this.personal = personal;
    });
  }

  send() {
    this.authService.update(this.phone, this.repository).subscribe(personal => {
      this.personal = personal;
    });
  }
}
