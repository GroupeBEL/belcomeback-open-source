import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProtectionPageRoutingModule } from './protection-routing.module';

import { ProtectionPage } from './protection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ProtectionPageRoutingModule
  ],
  declarations: [ProtectionPage]
})
export class ProtectionPageModule {}
