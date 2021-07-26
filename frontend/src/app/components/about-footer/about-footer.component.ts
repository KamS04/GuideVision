import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-footer',
  templateUrl: './about-footer.component.html',
  styleUrls: ['./about-footer.component.css']
})
export class AboutFooterComponent implements OnInit {

  members = ['Kam', 'Ayaan', 'Arshnur', 'Parneet', 'Harsh'];
  
  linkToInstagram = 'https://www.instagram.com/guiding.vision/';
  email = 'kaaphcas@gmail.com';

  constructor() { }

  ngOnInit(): void {
  }

}
