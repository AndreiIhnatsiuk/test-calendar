import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import { TopicsComponent } from './topics/topics.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { AdvancedComponent } from './advanced/advanced.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../interceptors/auth.interceptor';
import {AppModule} from '../app.module';
import {NotFoundComponent} from '../not-found/not-found.component';
import {MarkedPipe} from '../pipes/marked.pipe';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'topic/1',
      },
      {
        path: 'topics',
        redirectTo: 'topic/1',
      },
      {
        path: 'topic/:id',
        component: TopicsComponent
      },
      {
        path: 'advanced',
        component: AdvancedComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    TopicsComponent,
    AdvancedComponent,
    MarkedPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule
  ]
})
export class DashboardModule { }
