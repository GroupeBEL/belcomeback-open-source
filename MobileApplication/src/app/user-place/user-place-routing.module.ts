import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPlacePage } from './user-place.page';

const routes: Routes = [
  {
    path: '',
    component: UserPlacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPlacePageRoutingModule {}
