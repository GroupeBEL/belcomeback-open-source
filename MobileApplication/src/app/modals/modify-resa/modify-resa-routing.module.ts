import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyResaPage } from './modify-resa.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyResaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyResaPageRoutingModule {}
