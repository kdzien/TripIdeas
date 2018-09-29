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
  getAddress(geo): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`https://api.tomtom.com/search/2/reverseGeocode/${geo.lat},${geo.lng}.JSON?key=lnFJTllYtD8wNkWMLDGOV9iKGfoKUR3f`);
  }
}
