import { Component, OnInit, ViewChild } from '@angular/core';
import { Params, Router } from '@angular/router';
import { validate } from 'src/app/utils/search';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @ViewChild('searchButton') button;
  isMenuCollapsed = true;
  searchQuery = '';

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  search() {
    if (validate(this.searchQuery, undefined)) {
      const queryParams: Params = { query: this.searchQuery };
      this.router.navigate(
        ['search'],
        { queryParams, }
      );
      this.button.nativeElement.blur();
      this.searchQuery = '';
    }
  }

}
