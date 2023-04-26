import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PathFindingComponent} from './path-finding/path-finding.component';
import {IndexComponent} from './index/index.component';
import {SortingComponent} from "./sorting/sorting.component";
import {TreeComponent} from "./tree/tree.component";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'pathfinding',
    component: PathFindingComponent,
  },
  {
    path: 'sorting',
    component: SortingComponent,
  },
  {
    path: 'tree',
    component: TreeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
