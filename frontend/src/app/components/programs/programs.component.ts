import { Component, OnInit } from '@angular/core';
import { MiniProgram } from 'src/app/models/program';
import { RawDataService } from 'src/app/services/raw-data.service';
import { debugMode } from 'src/app/utils/config';
import { contract } from 'src/app/utils/observable';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  programs: MiniProgram[] = [];
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
      let data = await contract(this._Database.getMinifiedPrograms(this.limit, this.offset));
      let newPrograms = data.data;
      if (!debugMode) {
        this.offset += this.limit;
        if (newPrograms.length < this.limit) {
          this.completedResultSet = true;
        }
      } else {
        while (newPrograms.length < this.limit) {
          newPrograms.push(...newPrograms);
        }
      }
      this.programs.push(...newPrograms);
      this.isLoading = false
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }
  }

}
