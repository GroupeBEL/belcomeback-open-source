import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CantinePage } from './cantine.page';

const routes: Routes = [
  {
    path: '',
    component: CantinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CantinePageRoutingModule {}
