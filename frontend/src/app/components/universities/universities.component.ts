import { Component, OnInit } from '@angular/core';
import { University } from 'src/app/models/university';
import { RawDataService } from 'src/app/services/raw-data.service';
import { contract } from 'src/app/utils/observable';
import { debugMode } from 'src/app/utils/config';

@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.css']
})
export class UniversitiesComponent implements OnInit {
  universities: University[] = [];
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
      let data = await contract(this._Database.getUniversities(this.limit, this.offset));
      let newUniversities = data.data;
      if (!debugMode) {
        this.offset += this.limit;
        if(newUniversities.length < this.limit) {
          this.completedResultSet = true;
        }
      } else {
        while (newUniversities.length < this.limit) {
          newUniversities.push(...newUniversities);
        }
      }      
      this.universities.push(...newUniversities);
      this.isLoading = false;
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }
  }

}
