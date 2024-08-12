import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoginInputComponent } from './components/login-input/login-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UpdateProductsComponent } from './components/update-products/update-products.component';
import { UpdateAppliancesComponent } from './components/update-appliances/update-appliances.component';
import { UpdateClientsComponent } from './components/update-clients/update-clients.component';
import { UpdateProvidersComponent } from './components/update-providers/update-providers.component';
import { UpdateToolsComponent } from './components/update-tools/update-tools.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateAppliancesComponent,
    UpdateClientsComponent,
    UpdateEmployeeComponent,
    UpdateEmployeeComponent,
    UpdateProductsComponent,
    UpdateProvidersComponent,
    UpdateToolsComponent,
  ],
  exports: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateAppliancesComponent,
    UpdateClientsComponent,
    UpdateEmployeeComponent,
    UpdateEmployeeComponent,
    UpdateProductsComponent,
    UpdateProvidersComponent,
    UpdateToolsComponent,
    FormsModule,
    ReactiveFormsModule,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SharedModule { }
