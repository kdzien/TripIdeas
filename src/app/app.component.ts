import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  findModal = 'hide';

  toggleFindModal() {
    this.findModal = (this.findModal === 'hide' ? 'show' : 'hide');
  }
}
