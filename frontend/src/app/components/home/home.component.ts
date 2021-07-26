import { Component, OnInit } from '@angular/core';
import { University } from '../../models/university';
import { Category } from '../../models/category';
import { MiniCourse } from 'src/app/models/course';


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

  categoryPreview: Array<Category>;

  coursesPreview: Array<MiniCourse>;

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

    this.categoryPreview = [...Array(3)].map((_, i) => {
      let x = new Category();
      x.id = i;
      x.title = `Category #${i}`;
      return x;
    })
    
    this.coursesPreview = [...Array(3)].map((_, i) => {
      let x = new MiniCourse();
      x.courseId = i;
      x.courseTitle = `Course #${i}`;
      x.universityIconUrl = this.universitiesPreview[i].iconUrl;
      x.universityName = this.universitiesPreview[i].name;
      return x;
    })
  }

  courseLink(id: Number): String {
    return `/courses/${id}`;
  }

}
