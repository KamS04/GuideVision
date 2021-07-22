import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { University } from 'src/app/models/university';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  universitiesPreview: Array<University>;
  randomImage = 'data:image/jpeg;base64,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';

  colorMaps: { [id: number] : String; } = {};

  constructor() { }

  ngOnInit(): void {

    this.universitiesPreview = [...Array(10)].map((_, i) => {
      let x = new University();
      x.id = i;
      x.name = `University ${i}`;
      x.faculties = ['None'];
      x.phone= '1111111';
      x.streetAddress = '111 Some Street';
      x.city = 'Some City'
      x.provinceState = 'Some Province'
      x.country = 'Some Country';
      x.postalCode = 'S0M 3P2';
      x.url = 'magicman.org';
      x.iconUrl = 'magicboy.org';
      return x;
    });
  
  }

  randomColor(id: number): String {
    if (this.colorMaps[id] !== undefined) {
      return this.colorMaps[id];
    }
    let random = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    console.log(random);
    this.colorMaps[id] = random;
    return random;
  }

}