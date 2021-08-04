import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course';
import { ResultError } from 'src/app/models/result';
import { University } from 'src/app/models/university';
import { RawDataService } from 'src/app/services/raw-data.service';
import { contract } from 'src/app/utils/observable';
import { AbstractError } from '../views/display-four-o-four/error.interface';

@Component({
  selector: 'app-course-single',
  templateUrl: './course-single.component.html',
  styleUrls: ['./course-single.component.css']
})
export class CourseSingleComponent extends AbstractError implements OnInit {
  selectedCourse: Course;
  attachedUniversity: University;

  loadingUniversity = false;

  constructor(
    private _Database: RawDataService,
    private route: ActivatedRoute,
  ) { super(); }

  ngOnInit(): void {
    let urlId = this.route.snapshot.paramMap.get('id');
    let courseId = parseInt(urlId);
    if (isNaN(courseId)) {
      this.showError();
    } else {
      this.getCourse(courseId);
    }
  }

  async getCourse(courseId: number) {
    try {
      let data = await contract( this._Database.getCourse(courseId) );
      this.selectedCourse = data.data;
    } catch (err) {
      let resultErr = err as ResultError;
      if (resultErr !== undefined) {
        this.showError(resultErr.statusCode);
      } else {
        // TODO Error Handling
        console.log(err);
      }
    }

    this.loadUniversity();
  }

  async loadUniversity() {
    this.loadingUniversity = true;
    
    if (this.selectedCourse !== undefined) {
      try {
        let data = await contract( this._Database.getUniversity(this.selectedCourse.universityId) );
        this.attachedUniversity = data.data;
      } catch (err) {
        // TODO Error Handling
        console.log(err);
      }
    }
    
    this.loadingUniversity = false;
  }
}
