import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WaitingService {
  status = {
    modal: false,
    info: {
      show: false,
      text: '',
    }
  };
  $status = new Subject<any>();
  constructor() { }
  getStatus(): Observable<any> {
    return this.$status.asObservable();
  }
  setModalStatus(status) {
    this.status.modal = status;
    this.$status.next(this.status);
  }
  setInfoStatus(status, text = '') {
    this.status.info.show = status;
    this.status.info.text = text;
    this.$status.next(this.status);
    setTimeout(() => {
      this.setInfoStatus(false);
    }, 3000);
  }
}
