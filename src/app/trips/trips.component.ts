import { WaitingService } from './../services/waiting.service';
import { HttpService } from './../services/http.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapApiService } from '../services/map-api.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: [ '../create-route/create-route.component.scss', './trips.component.scss']
})
export class TripsComponent implements OnInit, OnDestroy {
  trips: Array<any>;
  constructor(private mapService: MapApiService, private httpService: HttpService, private waitingService: WaitingService) { }

  ngOnInit() {
    this.mapService.setPaintStatus(false);
    this.waitingService.setModalStatus(true);

    this.mapService.getCurrentPlace().subscribe( city => {
      this.httpService.getTrips(city).subscribe( trips => {
        this.trips = trips;
        this.waitingService.setModalStatus(false);
      });
    })
  }
  ngOnDestroy() {
    this.mapService.refreshMap([]);
    this.mapService.refreshMarkers([]);
  }
  showOnMap(elem){
    this.trips.forEach( elemx => {
      elemx.active = false;
    })
    elem.active = !elem.active;
    this.mapService.setMapCenter(new google.maps.LatLng(elem.coords[0].lat, elem.coords[0].lng));
    this.mapService.refreshMap(elem.coords);
    this.mapService.refreshMarkers(elem.markers || []);
  }
}
