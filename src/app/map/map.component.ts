import { MapApiService } from './../services/map-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  new_route_coordinates: Array<any> = [];
  constructor(private mapService: MapApiService) { }

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(51.092289, 17.039216),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    const flightPath = new google.maps.Polyline({
      path: this.new_route_coordinates,
      geodesic: true,
      strokeColor: '#4e3693',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    this.mapService.getMap().subscribe(mapx => {
      this.new_route_coordinates = mapx;
      flightPath.setPath(this.new_route_coordinates);
      flightPath.setMap(this.map);
    });

    google.maps.event.addListener(this.map, 'click', event => {
      const myLatLng = event.latLng;
      const new_geo = {lat: myLatLng.lat(), lng: myLatLng.lng(), address: undefined};
      this.mapService.getAddress(new_geo).subscribe(result => {
        new_geo.address = result.addresses[0].address.streetNameAndNumber || result.addresses[0].address.street ;
        console.log(result)
        this.mapService.updateMap(new_geo);
        flightPath.setPath(this.new_route_coordinates);
        flightPath.setMap(this.map);
      });
    });
  }

}
