import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { University } from 'src/app/models/university';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/models/category';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  universitiesPreview: Array<University>;

  logos = [
    'https://uwaterloo.ca/sites/uwaterloo.ca/themes/uw_home_theme/images/rwd-home/uwaterloo-logo.svg',
    'https://www.queensu.ca/sites/all/themes/queensbase_omega/images/wordmark_489x62.png',
    'https://www.utoronto.ca/sites/all/themes/uoft_stark/img/U-of-T-logo.png',
  ]

  categoryPreviews: Array<Category>;

  colorMaps: { [id: number] : String; } = {};

  constructor() { }

  ngOnInit(): void {
    this.universitiesPreview = [...Array(3)].map((_, i) => {
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
      x.iconUrl = this.logos[i];
      return x;
    });

    this.categoryPreviews = [...Array(3)].map((_, i) => {
      let x = new Category();
      x.id = i;
      x.title = `Category #${i}`;
      return x;
    })
  
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
