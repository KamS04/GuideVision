import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pathway } from 'src/app/models/pathway';
import { MiniProgram } from 'src/app/models/program';
import { ResultError } from 'src/app/models/result';
import { RawDataService } from 'src/app/services/raw-data.service';
import { contract } from 'src/app/utils/observable';
import { AbstractError } from '../views/display-four-o-four/error.interface';

@Component({
  selector: 'app-pathway-single',
  templateUrl: './pathway-single.component.html',
  styleUrls: ['./pathway-single.component.css']
})
export class PathwaySingleComponent extends AbstractError implements OnInit {
  pathwayId: number;
  selectedCategory: Pathway = null;

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
    let urlId = parseInt( this.route.snapshot.paramMap.get('id') );
    if (isNaN(urlId)) {
      this.showError();
    } else {
      this.hideError();
      this.pathwayId = urlId;
      this.getPathwayToDisplay();
    }    
  }

  async getPathwayToDisplay() {
    try {
      let data = await contract( this._Database.getCategory(this.pathwayId) );
      this.selectedCategory = data.data;
      this.hideError();
    } catch (err: any) {
      let resultErr = err as ResultError;
      if (resultErr !== undefined) {
        this.showError(resultErr.statusCode);
      } else {
        // TODO Error Handling
      }
    }
    if (this.selectedCategory != null) {
      this.loadPrograms();
    }
  }

  async loadPrograms() {
    this.isLoadingPrograms = true;
    try {
      let data = await contract( this._Database.getMinifiedProgramForCategory(this.pathwayId) );
      this.attachedPrograms = data.data;
    } catch (err) {
      // TODO Error handling
      console.error(err);
    }
    this.isLoadingPrograms = false;
  }

  back() {
    this.router.navigate(['/pathways']);
  }
}
