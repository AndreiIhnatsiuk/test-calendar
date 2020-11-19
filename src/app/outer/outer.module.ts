import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResetComponent} from './reset/reset.component';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {OuterComponent} from './outer.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {RenewComponent} from './renew/renew.component';
import {FormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RegistrationComponent} from './registration/registration.component';
import {UserAgreementComponent} from './user-agreement/user-agreement.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {AuthorizationComponent} from './authorization/authorization.component';
import {UserAgreementContentComponent} from './user-agreement-content/user-agreement-content.component';
import {UserAgreementDialogComponent} from './user-agreement-dialog/user-agreement-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: OuterComponent,
    children: [
      {
        path: '',
        component: AuthorizationComponent,
        children: [
          {
            path: '',
            redirectTo: 'sign-in'
          },
          {
            path: 'sign-in',
            component: LoginComponent
          },
          {
            path: 'sign-up',
            component: RegistrationComponent
          }
        ]
      },
      {
        path: 'reset',
        component: ResetComponent
      },
      {
        path: 'reset/:id',
        component: RenewComponent
      },
      {
        path: 'user-agreement',
        component: UserAgreementComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    OuterComponent,
    ResetComponent,
    LoginComponent,
    RenewComponent,
    RegistrationComponent,
    UserAgreementComponent,
    AuthorizationComponent,
    UserAgreementContentComponent,
    UserAgreementDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTabsModule
  ]
})
export class OuterModule { }
