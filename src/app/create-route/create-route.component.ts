import { Component, OnInit, NgZone } from '@angular/core';
import { MapApiService } from '../services/map-api.service';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit {
  coordinates: Array<any>;
  markers: Array<any>;
  distance: number;
  constructor(private mapService: MapApiService,private zone: NgZone) { }

  ngOnInit() {
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
  removeLast() {
    this.mapService.removeLast();
  }
  deleteAll() {
    this.mapService.deleteAll();
  }
  deleteMarker(index){
    this.mapService.deleteMarker(index);
  }
}
