import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResetComponent} from './reset/reset.component';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {OuterComponent} from './outer.component';
import {RenewComponent} from './renew/renew.component';
import {RegistrationComponent} from './registration/registration.component';
import {UserAgreementComponent} from './user-agreement/user-agreement.component';
import {MatTabsModule} from '@angular/material/tabs';
import {AuthorizationComponent} from './authorization/authorization.component';
import {UserAgreementContentComponent} from './user-agreement-content/user-agreement-content.component';
import {UserAgreementDialogComponent} from './user-agreement-dialog/user-agreement-dialog.component';
import {SharedModule} from '../shared/shared.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ConfirmEmailComponent} from './confirm-email/confirm-email.component';

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
      },
      {
        path: 'confirm/:id',
        component: ConfirmEmailComponent,
      },
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
    ConfirmEmailComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatTabsModule,
        SharedModule,
        MatCheckboxModule
    ]
})
export class OuterModule { }
