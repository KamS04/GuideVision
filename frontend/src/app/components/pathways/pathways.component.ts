import { Component, OnInit } from '@angular/core';
import { Pathway } from 'src/app/models/pathway';
import { RawDataService } from 'src/app/services/raw-data.service';
import { debugMode } from 'src/app/utils/config';
import { contract } from 'src/app/utils/observable';

@Component({
  selector: 'app-pathways',
  templateUrl: './pathways.component.html',
  styleUrls: ['./pathways.component.css']
})
export class PathwaysComponent implements OnInit {
  pathways: Pathway[] = [];
  isLoading: boolean = false;
  completedResultSet: boolean = false;
  limit = 16;
  offset = 0;

  constructor(private _Database: RawDataService) { }

  ngOnInit(): void {
  }

  onScroll() {
    if (!this.completedResultSet) {
      this.loadMore()
    }
  }

  async loadMore() {
    this.isLoading = true;
    try {
      let data = await contract(this._Database.getPathways(this.limit, this.offset));
      let newPathways = data.data;
      if (!debugMode) {
        this.offset += this.limit;
        if (newPathways.length < this.limit) {
          this.completedResultSet = true;
        }
      } else {
        while (newPathways.length < this.limit) {
          newPathways.push(...newPathways);
        }        
      }
      this.pathways.push(...newPathways);
      this.isLoading = false;
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }
  }
}
