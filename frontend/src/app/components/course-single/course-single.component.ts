import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/models/course';
import { ResultError } from 'src/app/models/result';
import { University } from 'src/app/models/university';
import { CompareDataService } from 'src/app/services/compare-data.service';
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
  addedToCompare = false;
  @ViewChild('compareBtn') compareBtn: ElementRef;

  constructor(
    private _Database: RawDataService,
    private route: ActivatedRoute,
    private router: Router,
    private _CompareList: CompareDataService,
  ) { super(); }

  public get canAddMore(): boolean {
    return this._CompareList.canAddMore;
  }

  public get compareListToolTip(): string {
    return this.canAddMore ? ( this.addedToCompare ? 'Already Added' : 'Add Course to Compare List' ) : 'Compare List is Full';
  }

  ngOnInit(): void {
    let urlId = this.route.snapshot.paramMap.get('id');
    let courseId = parseInt(urlId);
    if (isNaN(courseId)) {
      this.showError();
    } else {
      this.getCourse(courseId);
      if (this._CompareList.isAddedAlready(courseId)) {
        this.addedToCompare = true;
      }
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

  back() {
    this.router.navigate(['/programs']);
  }

  addToCompare() {
    if (this.selectedCourse !== undefined) {
      this._CompareList.addCourse(this.selectedCourse);
      this.addedToCompare = true;
      this.compareBtn.nativeElement.blur();
    }
  }
}
