import { WaitingService } from './../services/waiting.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waiting-modal',
  templateUrl: './waiting-modal.component.html',
  styleUrls: ['./waiting-modal.component.scss']
})
export class WaitingModalComponent implements OnInit {
  show_modal: boolean;
  show_info: any;
  constructor(private waitingService: WaitingService) { }

  ngOnInit() {
    this.waitingService.getStatus().subscribe(status => {
      this.show_modal = status.modal;
      this.show_info = status.info;
    });
  }
}
