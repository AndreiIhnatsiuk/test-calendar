import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MentorDashboardComponent} from './mentor-dashboard.component';
import {ACE_CONFIG, AceConfigInterface} from 'ngx-ace-wrapper';
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule} from '@angular/material/radio';
import {SharedModule} from '../shared/shared.module';
import {MentorSubmissionDialogComponent} from './mentor-submission-dialog/mentor-submission-dialog.component';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {
  useSoftTabs: true
};

const routes: Routes = [
  {
    path: '',
    component: MentorDashboardComponent,
  }
];

@NgModule({
  declarations: [
    MentorDashboardComponent,
    MentorSubmissionDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatRadioModule
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: {color: 'primary'},
    }
  ]
})
export class MentorDashboardModule {
}
