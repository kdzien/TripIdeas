import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
  currentSlide = 1;
  showTutorial = true;
  constructor() { }

  ngOnInit() {
  }
  nextSlide() {
    this.currentSlide === 3 ? this.showTutorial = false : this.currentSlide++;
  }
  cancel() {
    this.showTutorial = false;
  }

}
