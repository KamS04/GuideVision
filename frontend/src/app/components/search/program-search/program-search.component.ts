import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MiniProgram } from 'src/app/models/program';
import { RawDataService } from 'src/app/services/raw-data.service';
import { validateSearchCache, validate } from 'src/app/utils/search';
import { LAST_OVERALL_SEARCH, SEARCH_CACHE } from 'src/app/utils/config';
import { contract } from 'src/app/utils/observable';

@Component({
  selector: 'app-program-search',
  templateUrl: './program-search.component.html',
  styleUrls: ['./program-search.component.css']
})
export class ProgramSearchComponent implements OnInit {
  @ViewChild('searchButton') button;

  isLoading = false;

  searchQuery: string;
  currSearch: string;

  programResults: MiniProgram[] = [];
  limit = 15;
  offset = 0;
  completedResultSet = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _Database: RawDataService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params) => {
      if (validate(params.query, this.currSearch)) {
        this.beginSearch(params.query);
      } else {
        // TODO Error Handling
      }
    })
  }

  back() {
    let search = sessionStorage.getItem(LAST_OVERALL_SEARCH);
    let queryParams = search !== undefined ? { query: search } : undefined;
    this.router.navigate(
      ['search'],
      { queryParams }
    )
  }

  async beginSearch(query) {
    this.currSearch = query;
    this.searchQuery = query;
    
    this.resetTrackers();

    await this.loadCached();
    this.loadResults();
  }

  resetTrackers() {
    this.offset = 0;
    this.programResults = [];
    this.completedResultSet = false;
  }

  async loadCached() {
    let cachedData = await validateSearchCache(SEARCH_CACHE, MiniProgram, this.currSearch);
    
    if (cachedData !== undefined) {
      this.offset = cachedData.offset;
      this.programResults.push(...cachedData.results)

      if (cachedData.results.length < cachedData.limit) {
        this.completedResultSet = true;
      }

      localStorage.removeItem(SEARCH_CACHE);
    }
  }

  search() {
    if (validate(this.searchQuery, this.currSearch)) {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { query: this.searchQuery },
          queryParamsHandling: 'merge'
        }
      )
    }
    this.button.nativeElement.blur();
  }

  clearSearchText() {
    this.searchQuery = '';
  }

  onScroll() {
    if (!this.completedResultSet && !this.isLoading) {
      this.loadResults();
    }
  }

  async loadResults() {
    this.isLoading = true;
    try {
      let data = await contract( this._Database.searchProgram(this.currSearch, this.limit, this.offset) );
      this.programResults.push(...data.data);
      this.offset += this.limit;
      if (data.data.length < this.limit) {
        this.completedResultSet = true;
      }
    } catch (err) {
      // TODO Error Handling
    }

    this.isLoading = false;
  }


}
