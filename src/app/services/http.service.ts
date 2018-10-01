import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'https://api.mlab.com/api/1/databases/tripideas/collections/trips';
  private param: HttpParams;


  constructor(private http: HttpClient) { }

  getTrips(city?): Observable<Array<any>> {
    if (city) {
      this.param = new HttpParams().set('apiKey', 'hIfSGD4Yl2MCQATpWMzlhMm5yaybuPc0').set('q', `{"city": "${city}"}`);
    } else {
      this.param = new HttpParams().set('apiKey', 'hIfSGD4Yl2MCQATpWMzlhMm5yaybuPc0');
    }
    return this.http.get<Array<any>>(this.URL_DB, {params: this.param});
  }

  saveTrip(trip: any): Observable<any> {
    this.param = new HttpParams().set('apiKey', 'hIfSGD4Yl2MCQATpWMzlhMm5yaybuPc0');
    return this.http.post<any>(this.URL_DB, trip, { params: this.param});
  }
}
