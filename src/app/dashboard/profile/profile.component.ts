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
    this.authService.updatePersonal(this.phone, this.repository).subscribe(personal => {
      this.repository = null;
      this.phone = null;
      this.personal = personal;
    });
  }
}
