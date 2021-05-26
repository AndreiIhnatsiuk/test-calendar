import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {LessonComponent} from './lesson/lesson.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {ModuleComponent} from './module/module.component';
import {TaskComponent} from './task/task.component';
import {MatTableModule} from '@angular/material/table';
import {SubmissionComponent} from './submission/submission.component';
import {AceModule} from 'ngx-ace-wrapper';
import {ACE_CONFIG} from 'ngx-ace-wrapper';
import {AceConfigInterface} from 'ngx-ace-wrapper';
import {NgxMaskModule} from 'ngx-mask';
import {QuestionComponent} from './question/question.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {ChatComponent} from './chat/chat.component';
import {MatIconModule} from '@angular/material/icon';
import {ProgressComponent} from './progress/progress.component';
import {DashboardContentComponent} from './dashboard-content/dashboard-content.component';
import {NextStepComponent} from './next-step/next-step.component';
import * as url from './routes';
import {ProblemComponent} from './problem/problem.component';
import {SharedModule} from '../shared/shared.module';
import {AngularSplitModule} from 'angular-split';
import {MatMenuModule} from '@angular/material/menu';
import {GitTaskComponent} from './git-task/git-task.component';
import {GitSubmissionComponent} from './git-submission/git-submission.component';
import {ProfileComponent} from './profile/profile.component';
import {IMaskModule} from 'angular-imask';
import {PersonalPlanProgressComponent} from './personal-plan-progress/personal-plan-progress.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CountdownModule} from 'ngx-countdown';
import {PersonalPlanComponent} from './personal-plan/personal-plan.component';
import {PersonalPlanContentComponent} from './personal-plan-content/personal-plan-content.component';
import {ButtonProblemComponent} from './button-problem/button-problem.component';
import {HelpDialogComponent} from './help-dialog/help-dialog.component';

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
        component: DashboardContentComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'plan',
        component: PersonalPlanComponent,
      },
      {
        path: 'java/' + url.LESSON + '/:lessonId/' + url.PROBLEM + '/:problemId',
        redirectTo: url.MODULE + '/1/' + url.LESSON + '/:lessonId/' + url.PROBLEM + '/:problemId'
      },
      {
        path: 'java/' + url.LESSON + '/:lessonId',
        redirectTo: url.MODULE + '/1/' + url.LESSON + '/:lessonId'
      },
      {
        path: url.MODULE + '/:moduleId',
        component: ModuleComponent,
        children: [
          {
            path: url.LESSON + '/:lessonId',
            component: LessonComponent
          },
          {
            path: url.LESSON + '/:lessonId/' + url.PROBLEM + '/:problemId',
            component: ProblemComponent
          },
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    LessonComponent,
    ModuleComponent,
    TaskComponent,
    SubmissionComponent,
    QuestionComponent,
    ChatComponent,
    ProgressComponent,
    DashboardContentComponent,
    NextStepComponent,
    ProblemComponent,
    GitTaskComponent,
    GitSubmissionComponent,
    ProfileComponent,
    PersonalPlanProgressComponent,
    PersonalPlanComponent,
    PersonalPlanContentComponent,
    ButtonProblemComponent,
    HelpDialogComponent
  ],
  entryComponents: [
    SubmissionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    AceModule,
    NgxMaskModule.forRoot(),
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    SharedModule,
    AngularSplitModule,
    MatMenuModule,
    IMaskModule,
    MatProgressBarModule,
    CountdownModule
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
