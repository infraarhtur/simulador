import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { DynamicFrmComponent } from './components/dynamic-frm/dynamic-frm.component';


const appRoutes: Routes = [
  { path: '', component: DynamicFrmComponent },
   { path: '**', component: DynamicFrmComponent }

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
