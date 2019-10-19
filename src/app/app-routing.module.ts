import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: 'cabinet',
    loadChildren: () => import('./cabinet/cabinet.module').then(m => m.CabinetModule)
  },
  {
    path: '',
    loadChildren: () => import('./outer/outer.module').then(m => m.OuterModule)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
