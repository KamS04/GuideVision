import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-footer',
  templateUrl: './about-footer.component.html',
  styleUrls: ['./about-footer.component.css']
})
export class AboutFooterComponent implements OnInit {

  members = ['Kamalpreet Singh', 'Ayaan Nanji', 'Arshnur Ahluwalia', 'Parneet Singh', 'Harsh Nair'];
  
  linkToInstagram = 'https://www.instagram.com/guiding.vision/';
  email = 'guidingvision.help@gmail.com';

  constructor() { }

  ngOnInit(): void {
  }

}
