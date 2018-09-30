import { MapApiService } from './../services/map-api.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker_modal = false;
  marker_info = {
    title: 'Tytuł markera',
    description: 'Opis markera',
    lat: undefined,
    lng: undefined
  };
  all_markers = [];
  new_route_coordinates: Array<any> = [];
  new_route_markers: Array<any> = [];
  constructor(private mapService: MapApiService, private ngzone: NgZone) { }

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(51.092289, 17.039216),
      zoom: 15,
      fullscreenControl: false,
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

    this.mapService.getMarkers().subscribe(markersx => {
      this.all_markers.forEach(elem => {
        elem.setMap(null);
      });
      this.new_route_markers = markersx;
      this.new_route_markers.forEach(elem => {
        const marker = new google.maps.Marker({
          position: {lat: elem.lat, lng: elem.lng},
          map: this.map,
        });
        this.all_markers.push(marker);
        const contentString = `<div id="content">
        <div id="siteNotice">
        </div>
        <h1 id="firstHeading" class="firstHeading">${elem.title}</h1>
        <div id="bodyContent">
        <p>${elem.description}</p>
        </div>
        </div>`;
        const infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', () => {
          infowindow.open(this.map, marker);
        });
      });
    })

    google.maps.event.addListener(this.map, 'click', event => {
      const myLatLng = event.latLng;
      const new_geo = {lat: myLatLng.lat(), lng: myLatLng.lng(), address: undefined};
      this.mapService.getAddress(new_geo).subscribe(result => {
        new_geo.address = result.addresses[0].address.streetNameAndNumber || result.addresses[0].address.street;
        this.mapService.updateMap(new_geo);
        flightPath.setPath(this.new_route_coordinates);
        flightPath.setMap(this.map);
      });
    });
    google.maps.event.addListener(this.map, 'rightclick', event => {
      this.marker_modal = !this.marker_modal;
      this.ngzone.run(() => {});
      const myLatLng = event.latLng;
      const new_geo = {lat: myLatLng.lat(), lng: myLatLng.lng(), address: undefined};
      this.marker_info.lat = new_geo.lat;
      this.marker_info.lng = new_geo.lng;
    });
  }
  addMarker() {
    const new_marker = Object.assign({}, this.marker_info);
    this.mapService.updateMarkers(new_marker);
    this.marker_modal = !this.marker_modal;
  }

}
