import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Personal} from '../entities/personal';
import {LocalStorageService} from '../services/local-storage.service';
import {Gtag, GtagEventDirective} from 'angular-gtag';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {concat, of} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  personal: Personal;
  public href = '';

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private gtag: Gtag) {
  }

  ngOnInit() {
    this.authService.getMe().subscribe(personal => {
      this.personal = personal;
      this.gtag.setUserId(personal.analyticsId);
      this.gtag.event('set', {
        event_category: 'userId'
      });
    });
    this.href = this.router.url;
    concat(
      of(this.route.firstChild),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      )
    ).subscribe(event => {
      this.href = this.router.url;
    });
  }
}
