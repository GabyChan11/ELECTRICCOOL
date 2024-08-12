import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvidersPageRoutingModule } from './providers-routing.module';

import { ProvidersPage } from './providers.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProvidersPageRoutingModule,
    SharedModule
  ],
  declarations: [ProvidersPage]
})
export class ProvidersPageModule {}
