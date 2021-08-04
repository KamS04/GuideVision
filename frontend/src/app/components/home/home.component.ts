import { Component, OnInit } from '@angular/core';
import { University } from '../../models/university';
import { Category } from '../../models/category';
import { MiniCourse } from 'src/app/models/course';
import { RawDataService } from 'src/app/services/raw-data.service';
import { contract } from 'src/app/utils/observable';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  universitiesPreview: Array<University>;

  categoryPreview: Array<Category>;

  coursesPreview: Array<MiniCourse>;

  constructor( private _Database: RawDataService ) { }

  ngOnInit(): void {
    this.getUniversitiesPreview();
    this.getCoursesPreview();
    this.getCategoriesPreview();
  }

  async getUniversitiesPreview() {
    try {
      let universitiesData = await contract( this._Database.getRandomUniversities(3, 0) );
      this.universitiesPreview = universitiesData.data;
    } catch(err) {
      console.error(err); // Temporary
    }
  }

  async getCoursesPreview() {
    try {
      let coursesData = await contract( this._Database.getRandomMinifiedCourses(3, 0) );
      this.coursesPreview = coursesData.data;
    } catch(err) {
      console.error(err); // Temporary
    }
  }

  async getCategoriesPreview() {
    try {
      let categoriesData = await contract( this._Database.getRandomCategories(3, 0) );
      this.categoryPreview = categoriesData.data;
    } catch(err) {
      console.error(err); // Temporary
    }
  }

  courseLink(id: number): String {
    return `/courses/${id}`;
  }

}
