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
  constructor() { }

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    google.maps.event.addListener(this.map, 'click', event => {
      const myLatLng = event.latLng;
      const lat = myLatLng.lat();
      const lng = myLatLng.lng();
      this.new_route_coordinates.push({lat: lat, lng: lng});
      const flightPath = new google.maps.Polyline({
        path: this.new_route_coordinates,
        geodesic: true,
        strokeColor: '#8b00bb',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      flightPath.setMap(this.map);
    });
  }

}
