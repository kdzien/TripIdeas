import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CreateRouteComponent } from './create-route/create-route.component';
import { RouterModule } from '@angular/router';
import { app_routes } from '../app.routes';
import { TripsComponent } from './trips/trips.component';
import { WaitingModalComponent } from './waiting-modal/waiting-modal.component';
import { shim } from 'promise.prototype.finally';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
shim();

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CreateRouteComponent,
    TripsComponent,
    WaitingModalComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(
      app_routes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
