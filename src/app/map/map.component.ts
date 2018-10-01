import { WaitingService } from './../services/waiting.service';
import { MapApiService } from './../services/map-api.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { } from '@types/googlemaps';
import { Router, ActivatedRoute } from '@angular/router';
import { animate, trigger, state, style, transition } from '@angular/animations';
@Component({
  selector: 'app-map',
  animations: [
    trigger('openClose', [
      state('show', style({
        height: 'max-content',
      })),
      state('hide', style({
        height: '0px',
      }))
    ]),
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  findPlaceModal = 'show';
  map: google.maps.Map;
  marker_modal = false;
  cityname: String;
  cities: Array<any>;
  marker_info = this.setMarker();
  start_marker: google.maps.Marker;
  all_markers = [];
  new_route_coordinates: Array<any> = [];
  new_route_markers: Array<any> = [];
  paint_status: boolean;
  // tslint:disable-next-line:max-line-length
  constructor(private mapService: MapApiService, private ngzone: NgZone, private waitingService: WaitingService) { }

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
    this.mapService.getPaintStatus().subscribe( route => {
      this.paint_status = route;
    });
    this.mapService.getMapCenter().subscribe( mapcenter => {
      this.map.setCenter(mapcenter);
      this.map.setZoom(15);
    })
    this.mapService.getMap().subscribe(mapx => {
      if(this.start_marker){
        this.start_marker.setMap(null)
      };
      this.new_route_coordinates = mapx;
      if (this.new_route_coordinates.length > 0){
        this.start_marker = new google.maps.Marker({
          position: {lat: this.new_route_coordinates[0].lat, lng: this.new_route_coordinates[0].lng},
          map: this.map,
          icon : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });
      }
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
          map: this.map
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
      if(this.paint_status){
        const myLatLng = event.latLng;
        const new_geo = {lat: myLatLng.lat(), lng: myLatLng.lng(), address: undefined};
        this.mapService.getAddress(new_geo).subscribe(result => {
          new_geo.address = result.addresses[0].address.streetNameAndNumber || result.addresses[0].address.street || 'brak adresu';
          this.mapService.updateMap(new_geo);
          flightPath.setPath(this.new_route_coordinates);
          flightPath.setMap(this.map);
        });
      }
    });
    google.maps.event.addListener(this.map, 'rightclick', event => {
      if(this.paint_status){
        this.marker_modal = !this.marker_modal;
        this.ngzone.run(() => {});
        const myLatLng = event.latLng;
        const new_geo = {lat: myLatLng.lat(), lng: myLatLng.lng(), address: undefined};
        this.marker_info.lat = new_geo.lat;
        this.marker_info.lng = new_geo.lng;
      }
    });
  }
  setMarker() {
    return {
      title: 'Tytuł markera',
      description: 'Opis markera',
      lat: undefined,
      lng: undefined
    };
  }
  addMarker() {
    const new_marker = Object.assign({}, this.marker_info);
    this.mapService.updateMarkers(new_marker).then(() => {
      this.marker_modal = !this.marker_modal;
      this.marker_info = this.setMarker();
    }).catch( err => {
      this.waitingService.setInfoStatus(true, err);
    });
  }
  findPlace(){
    this.waitingService.setModalStatus(true);
    this.mapService.getGeocode(this.cityname).subscribe(res => {
      this.cities = res.results.filter( elem => elem.entityType === 'Municipality');
      this.waitingService.setModalStatus(false);
      this.findPlaceModal = 'show';
    }, err => {
      this.waitingService.setModalStatus(false);
      this.findPlaceModal = 'show';
    });
  }
  selectPlace(city) {
    console.log(city)
    this.mapService.changePlace(city.address.municipality);
    this.mapService.setMapCenter(new google.maps.LatLng(city.position.lat, city.position.lon));
  }
  toggleFindPlaceModal() {
    this.findPlaceModal = (this.findPlaceModal === 'hide' ? 'show' : 'hide');
  }
}
