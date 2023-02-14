import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as routes from '../../dashboard/routes';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.authService.confirmEmail(this.route.snapshot.paramMap.get('id')).subscribe(() => {
      this.snackBar.open('Почта подтверждена.', undefined, {
        duration: 10000
      });
      this.router.navigate(['/', routes.DASHBOARD]);
    }, e => {
      this.snackBar.open(e.error.message, undefined, {
        duration: 10000
      });
      this.router.navigate(['/', routes.DASHBOARD]);
    });
  }
}
