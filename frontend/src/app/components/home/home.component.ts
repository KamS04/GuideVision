import { Component, OnInit } from '@angular/core';
import { University } from '../../models/university';
import { Pathway } from '../../models/pathway';
import { MiniProgram } from 'src/app/models/program';
import { RawDataService } from 'src/app/services/raw-data.service';
import { contract } from 'src/app/utils/observable';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  universitiesPreview: Array<University>;

  pathwaysPreview: Array<Pathway>;

  programsPreview: Array<MiniProgram>;

  constructor( private _Database: RawDataService ) { }

  ngOnInit(): void {
    this.getUniversitiesPreview();
    this.getProgramsPreview();
    this.getPathwaysPreview();
  }

  async getUniversitiesPreview() {
    try {
      let universitiesData = await contract( this._Database.getRandomUniversities(3, 0) );
      this.universitiesPreview = universitiesData.data;
    } catch(err) {
      console.error(err); // Temporary
    }
  }

  async getProgramsPreview() {
    try {
      let programsData = await contract( this._Database.getRandomMinifiedPrograms(3, 0) );
      this.programsPreview = programsData.data;
    } catch(err) {
      console.error(err); // Temporary
    }
  }

  async getPathwaysPreview() {
    try {
      let pathwaysData = await contract( this._Database.getRandomPathways(3, 0) );
      this.pathwaysPreview = pathwaysData.data;
    } catch(err) {
      console.error(err); // Temporary
    }
  }

  programLink(id: number): String {
    return `/programs/${id}`;
  }

}
