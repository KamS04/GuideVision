import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MiniProgram } from 'src/app/models/program';
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

  attachedPrograms: MiniProgram[] = [];
  isLoadingPrograms: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private _Database: RawDataService,
    private router: Router,
  ) {
    super();
    
  }

  ngOnInit(): void {
    let urlId = parseInt( this.route.snapshot.paramMap.get('id'), 10 );
    if (Number.isNaN(urlId)) {
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
      this.loadPrograms();
    }
  }

  async loadPrograms() {
    this.isLoadingPrograms = true;

    try {
      let data = await contract( this._Database.getMinifiedProgramForUniversity(this.universityId) );
      this.attachedPrograms = data.data;
      console.log(this.attachedPrograms);
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }

    this.isLoadingPrograms = false;
  }

  back() {
    this.router.navigate(['/universities']);
  }

}
