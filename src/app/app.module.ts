import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CreateRouteComponent } from './create-route/create-route.component';
import { RouterModule } from '@angular/router';
import { app_routes } from '../app.routes';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CreateRouteComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      app_routes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
