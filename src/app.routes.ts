import { CreateRouteComponent } from './app/create-route/create-route.component';
import { Routes } from '@angular/router';

export const app_routes: Routes = [
  { path: '', pathMatch: 'prefix', redirectTo: 'create-route'},
  { path: 'create-route', component: CreateRouteComponent}
];
