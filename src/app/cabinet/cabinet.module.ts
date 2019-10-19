import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetComponent } from './cabinet.component';
import {RouterModule, Routes} from '@angular/router';
import { LessonsComponent } from './lessons/lessons.component';

const routes: Routes = [
  {
    path: '',
    component: CabinetComponent,
    children: [
      {
        path: '',
        component: LessonsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [CabinetComponent, LessonsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CabinetModule { }
