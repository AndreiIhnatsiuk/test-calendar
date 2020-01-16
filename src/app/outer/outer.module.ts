import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetComponent } from './reset/reset.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OuterComponent } from './outer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RenewComponent } from './renew/renew.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: OuterComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'reset',
        component: ResetComponent
      },
      {
        path: 'reset/:id',
        component: RenewComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    OuterComponent,
    ResetComponent,
    LoginComponent,
    RenewComponent
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
    MatProgressSpinnerModule
  ]
})
export class OuterModule { }
