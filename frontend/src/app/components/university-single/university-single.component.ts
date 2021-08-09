import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MiniCourse } from 'src/app/models/course';
import { ResultError } from 'src/app/models/result';
import { University } from 'src/app/models/university';
import { RawDataService } from 'src/app/services/raw-data.service';
import { contract } from 'src/app/utils/observable';
import { AbstractError } from '../views/display-four-o-four/error.interface';

@Component({
  selector: 'app-university-single',
  templateUrl: './university-single.component.html',
  styleUrls: ['./university-single.component.css']
})
export class UniversitySingleComponent extends AbstractError implements OnInit {
  universityId: number;
  selectedUniversity: University;

  attachedCourses: MiniCourse[] = [];
  isLoadingCourses: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private _Database: RawDataService,
    private router: Router,
  ) {
    super();
    
  }

  ngOnInit(): void {
    let urlId = parseInt( this.route.snapshot.paramMap.get('id') );
    if (isNaN(urlId)) {
      this.showError();
    } else {
      this.hideError();
      this.universityId = urlId;
      this.getUniversityToDisplay();
    }
  }

  async getUniversityToDisplay() {
    try {
      let data = await contract( this._Database.getUniversity(this.universityId) );
      this.selectedUniversity = data.data;
      this.hideError();
    } catch (err: any) {
      let resultErr = err as ResultError;
      if (resultErr !== undefined) {
        this.showError(resultErr.statusCode);        
      } else {
        // TODO Error Handling
      }
    }

    if (this.selectedUniversity != null) {
      this.loadCourses();
    }
  }

  async loadCourses() {
    this.isLoadingCourses = true;

    try {
      let data = await contract( this._Database.getMinifiedCourseForUniversity(this.universityId) );
      this.attachedCourses = data.data;
      console.log(this.attachedCourses);
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }

    this.isLoadingCourses = false;
  }

  back() {
    this.router.navigate(['/universities']);
  }

}
