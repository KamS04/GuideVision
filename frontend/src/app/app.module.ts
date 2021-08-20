import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PathwaysComponent } from './components/pathways/pathways.component';
import { HomeComponent } from './components/home/home.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { UniversitiesComponent } from './components/universities/universities.component';
import { PathwaySingleComponent } from './components/pathway-single/pathway-single.component';
import { UniversitySingleComponent } from './components/university-single/university-single.component';
import { AboutFooterComponent } from './components/about-footer/about-footer.component';
import { ProgramSingleComponent } from './components/program-single/program-single.component';
import { LazyPresenterComponent } from './components/views/lazy-presenter/lazy-presenter.component';
import { LoadingBarComponent } from './components/views/loading-bar/loading-bar.component';
import { DisplayFourOFourComponent } from './components/views/display-four-o-four/display-four-o-four.component';
import { UniversityCardViewComponent } from './components/views/university-card-view/university-card-view.component';
import { ProgramCardViewComponent } from './components/views/program-card-view/program-card-view.component';
import { PathwayCardViewComponent } from './components/views/pathway-card-view/pathway-card-view.component';
import { OverallSearchComponent } from './components/search/overall-search/overall-search.component';
import { UniversitySearchComponent } from './components/search/university-search/university-search.component';
import { ProgramSearchComponent } from './components/search/program-search/program-search.component';
import { PathwaySearchComponent } from './components/search/pathway-search/pathway-search.component';
import { CompareComponent } from './components/compare/compare.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pathways', component: PathwaysComponent },
  { path: 'programs', component: ProgramsComponent },
  { path: 'universities', component: UniversitiesComponent },
  { path: 'pathways/:id', component: PathwaySingleComponent },
  { path: 'universities/:id', component: UniversitySingleComponent },
  { path: 'programs/:id', component: ProgramSingleComponent },
  { path: 'search', component: OverallSearchComponent },
  { path: 'search/universities', component: UniversitySearchComponent },
  { path: 'search/programs', component: ProgramSearchComponent },
  { path: 'search/pathways', component: PathwaySearchComponent },
  { path: 'compare', component: CompareComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    PathwaysComponent,
    ProgramsComponent,
    UniversitiesComponent,
    PathwaySingleComponent,
    UniversitySingleComponent,
    AboutFooterComponent,
    ProgramSingleComponent,
    LazyPresenterComponent,
    LoadingBarComponent,
    DisplayFourOFourComponent,
    UniversityCardViewComponent,
    ProgramCardViewComponent,
    PathwayCardViewComponent,
    OverallSearchComponent,
    UniversitySearchComponent,
    ProgramSearchComponent,
    PathwaySearchComponent,
    CompareComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' }),
    NgbModule,
    MarkdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
