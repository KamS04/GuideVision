import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { CompareDataService } from 'src/app/services/compare-data.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  selectedCourses: Course[];
  numberOfCourses: number = 0;

  constructor(
    private _CompareList: CompareDataService,
  ) {
    this.getCompareList();
  }

  ngOnInit(): void {
    this._CompareList.compareListChanged.subscribe( (length) => {
      console.log(length);
      this.getCompareList();
    });
  }

  getCompareList() {
    this.selectedCourses = this._CompareList.getCompareList();
    this.numberOfCourses = this._CompareList.listLength;
  }

  magic(course, event) {
    this._CompareList.removeCourse(course);
    event.target.blur();
  }

}
