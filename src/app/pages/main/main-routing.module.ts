import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('./clients/clients.module').then( m => m.ClientsPageModule)
      },
      {
        path: 'appliances',
        loadChildren: () => import('./appliances/appliances.module').then( m => m.AppliancesPageModule)
      },
      {
        path: 'providers',
        loadChildren: () => import('./providers/providers.module').then( m => m.ProvidersPageModule)
      },
      {
        path: 'tools',
        loadChildren: () => import('./tools/tools.module').then( m => m.ToolsPageModule)
      },
      {
        path: 'employees',
        loadChildren: () => import('./employees/employees.module').then( m => m.EmployeesPageModule)
      },
      {
        path: 'finances',
        loadChildren: () => import('./finances/finances.module').then( m => m.FinancesPageModule)
      }
    ]
  },
  
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
