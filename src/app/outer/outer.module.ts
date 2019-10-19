import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetComponent } from './reset/reset.component';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OuterComponent } from './outer.component';

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
      }
    ]
  }
];

@NgModule({
  declarations: [ResetComponent, LoginComponent, OuterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OuterModule { }
