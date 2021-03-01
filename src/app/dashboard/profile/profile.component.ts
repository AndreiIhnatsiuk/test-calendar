import {Component, OnInit} from '@angular/core';
import {Personal} from '../../entities/personal';
import {AuthService} from '../../services/auth.service';

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
    if (this.phone) {
      this.authService.updatePhone('+375' + this.phone).subscribe(personal => {
        this.personal = personal;
      });
    }
    if (this.repository) {
      this.authService.updateRepository(this.repository).subscribe(personal => {
        this.personal = personal;
      });
    }
  }
}
