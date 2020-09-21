import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyResaPageRoutingModule } from './modify-resa-routing.module';

import { ModifyResaPage } from './modify-resa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    IonicModule,
    ModifyResaPageRoutingModule
  ],
  declarations: [ModifyResaPage]
})
export class ModifyResaPageModule {}
