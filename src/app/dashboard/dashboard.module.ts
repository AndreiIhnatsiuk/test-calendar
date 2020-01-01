import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {TopicComponent} from './topic/topic.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {BasicComponent} from './basic/basic.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MarkedPipe} from '../pipes/marked.pipe';
import {BeginnerComponent} from './beginner/beginner.component';
import {TaskComponent} from './task/task.component';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { SubmissionComponent } from './submission/submission.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'beginner',
      },
      {
        path: 'beginner',
        component: BeginnerComponent,
        children: [
          {
            path: '',
            redirectTo: 'topic/1'
          },
          {
            path: 'topic/:topicId',
            component: TopicComponent
          },
          {
            path: 'topic/:topicId/task/:taskId',
            component: TaskComponent
          }
        ]
      },
      {
        path: 'basic',
        component: BasicComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    TopicComponent,
    BasicComponent,
    MarkedPipe,
    BeginnerComponent,
    TaskComponent,
    SubmissionComponent
  ],
  entryComponents: [
    SubmissionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class DashboardModule {
}
