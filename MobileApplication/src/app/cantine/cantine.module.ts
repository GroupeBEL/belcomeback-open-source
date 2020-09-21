import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CantinePageRoutingModule } from './cantine-routing.module';

import { CantinePage } from './cantine.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CantinePageRoutingModule
  ],
  declarations: [CantinePage]
})
export class CantinePageModule {}
