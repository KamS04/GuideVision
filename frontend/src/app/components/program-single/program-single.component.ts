import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Program } from 'src/app/models/program';
import { ResultError } from 'src/app/models/result';
import { University } from 'src/app/models/university';
import { CompareDataService } from 'src/app/services/compare-data.service';
import { RawDataService } from 'src/app/services/raw-data.service';
import { contract } from 'src/app/utils/observable';
import { AbstractError } from '../views/display-four-o-four/error.interface';

@Component({
  selector: 'app-program-single',
  templateUrl: './program-single.component.html',
  styleUrls: ['./program-single.component.css']
})
export class ProgramSingleComponent extends AbstractError implements OnInit {
  selectedProgram: Program;
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
    return this.canAddMore ? ( this.addedToCompare ? 'Already Added' : 'Add Program to Compare List' ) : 'Compare List is Full';
  }

  ngOnInit(): void {
    let urlId = this.route.snapshot.paramMap.get('id');
    let programId = parseInt(urlId);
    if (isNaN(programId)) {
      this.showError();
    } else {
      this.getProgram(programId);
      if (this._CompareList.isAddedAlready(programId)) {
        this.addedToCompare = true;
      }
    }
  }

  async getProgram(programId: number) {
    try {
      let data = await contract( this._Database.getProgram(programId) );
      this.selectedProgram = data.data;
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
    
    if (this.selectedProgram !== undefined) {
      try {
        let data = await contract( this._Database.getUniversity(this.selectedProgram.universityId) );
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
    if (this.selectedProgram !== undefined) {
      this._CompareList.addProgram(this.selectedProgram, this.attachedUniversity);
      this.addedToCompare = true;
      this.compareBtn.nativeElement.blur();
    }
  }
}
