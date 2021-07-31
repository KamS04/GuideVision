import { Component, OnInit } from '@angular/core';
import { University } from 'src/app/models/university';
import { RawDataService } from 'src/app/services/raw-data.service';
import { contract } from 'src/app/utils/observable';

@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.css']
})
export class UniversitiesComponent implements OnInit {
  universities: University[] = [];
  offset = 0;
  limit = 15;
  isLoading = false;
  completedResultSet = false;
  debug = true;

  constructor(private _Database: RawDataService) { }

  ngOnInit(): void {
    // this.loadData();
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
      // this.offset += this.limit;
      // if(newUniversities.length < this.limit) {
      //   this.completedResultSet = true;
      // }
      while (newUniversities.length < this.limit) {
        newUniversities.push(...newUniversities);
      }
      this.universities.push(...newUniversities);
      this.isLoading = false;
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }
  }

}
