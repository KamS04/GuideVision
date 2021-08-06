import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { MiniCourse } from 'src/app/models/course';
import { University } from 'src/app/models/university';
import { RawDataService } from 'src/app/services/raw-data.service';
import { LAST_OVERALL_SEARCH, SEARCH_CACHE } from 'src/app/utils/config';
import { contract } from 'src/app/utils/observable';
import { validate } from 'src/app/utils/search';

@Component({
  selector: 'app-overall-search',
  templateUrl: './overall-search.component.html',
  styleUrls: ['./overall-search.component.css']
})
export class OverallSearchComponent implements OnInit {
  searchQuery: string;
  currSearch: string;

  @ViewChild('searchButton') searchButton: ElementRef;

  resultLimit = 5;

  universityResults: University[];
  categoryResults: Category[];
  courseResults: MiniCourse[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _Database: RawDataService,
  ) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe( (queryParams) => {
      if (validate(queryParams.query, this.currSearch)) {
        this.beginSearch(queryParams.query)
      } else {
        // TODO Error Handling
      }
    })
  }

  beginSearch(query) {
    this.currSearch = query;
    this.searchQuery = query;

    this.searchUniversities();
    this.searchCategories();
    this.searchCourses();

    sessionStorage.setItem(LAST_OVERALL_SEARCH, query);
  }

  clearSearchText() {
    this.searchQuery = '';
  }

  search() {
    this.searchButton.nativeElement.blur();

    if (validate(this.searchQuery, this.currSearch)) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { query: this.searchQuery },
        queryParamsHandling: 'merge',
      })
    }
  }

  async searchUniversities() {
    try {
      let data = await contract( this._Database.searchUniversity(this.currSearch, this.resultLimit, 0) );
      this.universityResults = data.data;
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }
  }

  moreUniversities() {
    localStorage.setItem(SEARCH_CACHE, JSON.stringify({
      limit: this.resultLimit,
      offset: this.resultLimit,
      query: this.currSearch,
      results: this.universityResults
    }));

    this.router.navigate(
      ['search', 'universities'],
      { queryParams: { query: this.currSearch } },
    );
  }

  async searchCategories() {
    try {
      let data = await contract( this._Database.searchCategory(this.currSearch, this.resultLimit, 0) );
      this.categoryResults = data.data;
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }
  }

  moreCategories() {
    localStorage.setItem(SEARCH_CACHE, JSON.stringify({
      limit: this.resultLimit,
      offset: this.resultLimit,
      query: this.currSearch,
      results: this.categoryResults
    }));
    
    this.router.navigate(
      ['search', 'pathways'],
      { queryParams: { query: this.currSearch } },
    );
  }

  async searchCourses() {
    try {
      let data = await contract( this._Database.searchCourse(this.currSearch, this.resultLimit, 0) );
      this.courseResults = data.data;
    } catch (err) {
      // TODO Error Handling
      console.error(err);
    }
  }

  moreCourses() {
    localStorage.setItem(SEARCH_CACHE, JSON.stringify({
      limit: this.resultLimit,
      offset: this.resultLimit,
      query: this.currSearch,
      results: this.courseResults
    }));
    
    this.router.navigate(
      ['search', 'courses'],
      { queryParams: { query: this.currSearch } },
    );
  }

}
