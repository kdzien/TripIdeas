import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapApiService {
  constructor(private http: HttpClient, private httpService: HttpService) { }
  $geo_tab = new Subject<Array<any>>();
  geo_tab: Array<any> = [];

  $paint_active = new Subject<boolean>();
  paint_active = true;

  $markers_tab = new Subject<Array<any>>();
  markers_tab: Array<any> = [];

  current_place: '';
  $current_place = new BehaviorSubject<String>(this.current_place);

  $map_center = new Subject<google.maps.LatLng>();
  map_center: google.maps.LatLng = new google.maps.LatLng(51.092289, 17.039216);

  getPaintStatus(): Observable<boolean>{
    return this.$paint_active.asObservable();
  }
  setPaintStatus(status){
    this.paint_active = status;
    this.$paint_active.next(this.paint_active);
  }
  getMapCenter(): Observable<google.maps.LatLng> {
    return this.$map_center.asObservable();
  }
  setMapCenter(center) {
    this.map_center = center;
    this.$map_center.next(this.map_center);
  }
  updateMarkers(marker): Promise<any> {
    return new Promise((resolve,reject) => {
      if (!marker.title || marker.title.length < 3){
        return reject('Uzupełnij tytuł (minimum 3 znaków)');
      } else if (!marker.description || marker.description.length < 10 ){
        return reject('Uzupełnij opis (minimum 10 znaków)');
      } else {
        this.markers_tab.push(marker);
        this.$markers_tab.next(this.markers_tab);
        return resolve();
      }
    });
  }
  getMarkers(): Observable<Array<any>> {
    return this.$markers_tab.asObservable();
  }
  deleteMarker(index) {
    this.markers_tab.splice(index, 1);
    this.$markers_tab.next(this.markers_tab);
  }
  updateMap(coordinates) {
    this.geo_tab.push(coordinates);
    this.$geo_tab.next(this.geo_tab);
  }
  refreshMap(coord_array) {
    this.geo_tab = coord_array;
    this.$geo_tab.next(this.geo_tab);
  }
  refreshMarkers(markers_array) {
    this.markers_tab = markers_array;
    this.$markers_tab.next(this.markers_tab);
  }
  getMap(): Observable<Array<any>> {
    return this.$geo_tab.asObservable();
  }
  removeLast() {
    this.geo_tab.pop();
    this.$geo_tab.next(this.geo_tab);
  }
  deleteAll() {
    this.geo_tab = [];
    this.$geo_tab.next(this.geo_tab);
  }
  saveTrip(coords, markers): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getAddress(coords[0]).subscribe( result => {
        console.log(result)
        const city = result.addresses[0].address.municipality || 'Brak miasta';
        this.httpService.saveTrip({coords: coords, markers: markers, city: city, length: this.getDistance(coords)}).subscribe( trip => {
          resolve(trip);
        }, err => {
          reject(err);
        });
      });
    });
  }
  changePlace(city) {
    this.current_place = city;
    this.$current_place.next(this.current_place);
  }
  getCurrentPlace(): Observable<any> {
    return this.$current_place.asObservable();
  }
  getAddress(geo): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`https://api.tomtom.com/search/2/reverseGeocode/${geo.lat},${geo.lng}.JSON?key=lnFJTllYtD8wNkWMLDGOV9iKGfoKUR3f`);
  }
  getGeocode(cityname): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`https://api.tomtom.com/search/2/geocode/${cityname ? cityname : '%20'}.JSON?key=lnFJTllYtD8wNkWMLDGOV9iKGfoKUR3f&language=pl-PL`);
  }
  getDistance(points): number {
    let total = 0;
    for (let i = 0; i <= points.length - 1 ; i++) {
      if (points[i + 1]) {
        // tslint:disable-next-line:max-line-length
        const distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(points[i].lat, points[i].lng), new google.maps.LatLng(points[i + 1].lat, points[i + 1].lng));
        total += distance;
      }
    }
    return total / 1000;
  }
}
