import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MapApiService } from '../services/map-api.service';
import { WaitingService } from '../services/waiting.service';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit, OnDestroy {
  coordinates: Array<any>;
  markers: Array<any>;
  distance: number;
  constructor(private mapService: MapApiService, private waitingService: WaitingService, private zone: NgZone) { }

  ngOnInit() {
    this.mapService.setPaintStatus(true);
    this.mapService.getMap().subscribe( (map: any) => {
      this.coordinates = map;
      this.distance = this.mapService.getDistance(this.coordinates);
      this.zone.run(() => {});
    });
    this.mapService.getMarkers().subscribe( (markers: any) => {
      this.markers = markers;
      this.zone.run(() => {});
    });
  }
  ngOnDestroy() {
    this.mapService.refreshMap([]);
    this.mapService.refreshMarkers([]);
  }
  removeLast() {
    this.mapService.removeLast();
  }
  deleteAll() {
    this.mapService.deleteAll();
  }
  deleteMarker(index){
    this.mapService.deleteMarker(index);
  }
  saveTrip() {
    this.waitingService.setModalStatus(true);
    this.mapService.saveTrip(this.coordinates, this.markers).then(trip => {
      this.waitingService.setInfoStatus(true, 'Poprawnie dodano trasę')
    }).catch( err => {
      this.waitingService.setInfoStatus(true, err)
    }).finally(() => {
      this.waitingService.setModalStatus(false);
    });
  }
}
