import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapApiService {
  constructor(private http: HttpClient) { }
  $geo_tab = new Subject<Array<any>>();
  geo_tab: Array<any> = [];
  $markers_tab = new Subject<Array<any>>();
  markers_tab: Array<any> = [];

  updateMarkers(marker) {
    this.markers_tab.push(marker);
    this.$markers_tab.next(this.markers_tab);
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
  getMap(): Observable<Array<any>> {
    return this.$geo_tab.asObservable();
  }
  removeLast() {
    this.geo_tab.pop();
    this.$geo_tab.next(this.geo_tab);
  }
  deleteAll(){
    this.geo_tab = [];
    this.$geo_tab.next(this.geo_tab);
  }
  getAddress(geo): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`https://api.tomtom.com/search/2/reverseGeocode/${geo.lat},${geo.lng}.JSON?key=lnFJTllYtD8wNkWMLDGOV9iKGfoKUR3f`);
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
