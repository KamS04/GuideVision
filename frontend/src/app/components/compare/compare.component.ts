import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { University } from 'src/app/models/university';
import { CompareDataService } from 'src/app/services/compare-data.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  selectedItems: Map<Course, University>;
  numberOfCourses: number = 0;
  universitiesMap: Map<number, University>;

  constructor(
    private _CompareList: CompareDataService,
  ) {
    this.getCompareList();
  }

  public get selectedCourses(): Course[] {
    return Array.from(this.selectedItems.keys());
  }  

  ngOnInit(): void {
    this._CompareList.compareMapChanged.subscribe( (length) => {
      console.log(length);
      this.getCompareList();
    });
  }

  getCompareList() {
    this.selectedItems = this._CompareList.getCompareMap();
    this.numberOfCourses = this._CompareList.mapSize;
    this.universitiesMap = Array.from(this.selectedItems.entries()).reduce( (map, [course, uni]) => {
      map.set(course.id, uni);
      return map;
    }, new Map<number, University>()
    )
  }

  remove(course, event) {
    this._CompareList.removeCourse(course);
    event.target.blur();
  }

  getIcon(course: Course): String {
    return this.universitiesMap.get(course.id).iconUrl;
  }

  getUniMap(course: Course): String {
    return this.universitiesMap.get(course.id).name;
  }

}
