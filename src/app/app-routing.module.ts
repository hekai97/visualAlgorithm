import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathFindingComponent } from './path-finding/path-finding.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'pathfinding',
    component: PathFindingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
