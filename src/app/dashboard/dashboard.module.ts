import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {SubtopicComponent} from './topic/subtopic.component';
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
import {SubmissionComponent} from './submission/submission.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AceModule} from 'ngx-ace-wrapper';
import {ACE_CONFIG} from 'ngx-ace-wrapper';
import {AceConfigInterface} from 'ngx-ace-wrapper';
import {IntroComponent} from './intro/intro.component';
import {MatInputModule} from '@angular/material/input';
import {NgxMaskModule} from 'ngx-mask';
import {QuestionComponent} from './question/question.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';


const DEFAULT_ACE_CONFIG: AceConfigInterface = {
  useSoftTabs: true
};

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
            redirectTo: 'subtopic/1'
          },
          {
            path: 'subtopic/:subtopicId',
            component: SubtopicComponent
          },
          {
            path: 'subtopic/:subtopicId/task/:taskId',
            component: TaskComponent
          },
          {
            path: 'subtopic/:subtopicId/question/:questionId',
            component: QuestionComponent
          }
        ]
      },
      {
        path: 'basic',
        component: BasicComponent
      },
      {
        path: 'basic/intro/:registrationId',
        component: IntroComponent
      },
      {
        path: 'basic/intro/:registrationId/task/:taskId',
        component: IntroComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    SubtopicComponent,
    BasicComponent,
    MarkedPipe,
    BeginnerComponent,
    TaskComponent,
    SubmissionComponent,
    IntroComponent,
    QuestionComponent
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
    MatDialogModule,
    MatProgressSpinnerModule,
    AceModule,
    MatInputModule,
    NgxMaskModule.forRoot(),
    MatCheckboxModule,
    MatExpansionModule
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    }
  ]
})
export class DashboardModule {
}
