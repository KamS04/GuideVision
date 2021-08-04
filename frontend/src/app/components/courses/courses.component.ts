import { Component, OnInit } from '@angular/core';
import { MiniCourse } from 'src/app/models/course';
import { RawDataService } from 'src/app/services/raw-data.service';
import { debugMode } from 'src/app/utils/config';
import { contract } from 'src/app/utils/observable';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: MiniCourse[] = [];
  offset = 0;
  limit = 16;
  isLoading = false;
  completedResultSet = false;  

  constructor(private _Database: RawDataService) { }

  ngOnInit(): void {
  }

  onScroll() {
    if (!this.completedResultSet) {
      this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      let data = await contract(this._Database.getMinifiedCourses(this.limit, this.offset));
      let newCourses = data.data;
      if (!debugMode) {
        this.offset += this.limit;
        if (newCourses.length < this.limit) {
          this.completedResultSet = true;
        }
      } else {
        while (newCourses.length < this.limit) {
          newCourses.push(...newCourses);
        }
      }
      this.courses.push(...newCourses);
      this.isLoading = false
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }
  }

}
