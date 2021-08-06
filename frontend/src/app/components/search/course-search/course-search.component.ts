import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MiniCourse } from 'src/app/models/course';
import { RawDataService } from 'src/app/services/raw-data.service';
import { validateSearchCache, validate } from 'src/app/utils/search';
import { LAST_OVERALL_SEARCH, SEARCH_CACHE } from 'src/app/utils/config';
import { contract } from 'src/app/utils/observable';

@Component({
  selector: 'app-course-search',
  templateUrl: './course-search.component.html',
  styleUrls: ['./course-search.component.css']
})
export class CourseSearchComponent implements OnInit {
  @ViewChild('searchButton') button;

  isLoading = false;

  searchQuery: string;
  currSearch: string;

  courseResults: MiniCourse[] = [];
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
    this.courseResults = [];
    this.completedResultSet = false;
  }

  async loadCached() {
    let cachedData = await validateSearchCache(SEARCH_CACHE, MiniCourse, this.currSearch);
    
    if (cachedData !== undefined) {
      this.offset = cachedData.offset;
      this.courseResults.push(...cachedData.results)

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
      let data = await contract( this._Database.searchCourse(this.currSearch, this.limit, this.offset) );
      this.courseResults.push(...data.data);
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
