import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtectionPage } from './protection.page';

const routes: Routes = [
  {
    path: '',
    component: ProtectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectionPageRoutingModule {}
