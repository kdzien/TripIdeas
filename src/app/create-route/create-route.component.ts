import { Component, OnInit, NgZone } from '@angular/core';
import { MapApiService } from '../services/map-api.service';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit {
  coordinates: Array<any>;
  constructor(private mapService: MapApiService,private zone: NgZone) { }

  ngOnInit() {

    this.mapService.getMap().subscribe( (map: any) => {
      this.coordinates = map;
      this.zone.run(() => {
      });
    });
  }
  removeLast() {
    this.mapService.removeLast();
  }
}
