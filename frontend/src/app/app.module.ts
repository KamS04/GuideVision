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
import { CoursesComponent } from './components/courses/courses.component';
import { UniversitiesComponent } from './components/universities/universities.component';
import { PathwaySingleComponent } from './components/pathway-single/pathway-single.component';
import { UniversitySingleComponent } from './components/university-single/university-single.component';
import { AboutFooterComponent } from './components/about-footer/about-footer.component';
import { CourseSingleComponent } from './components/course-single/course-single.component';
import { LazyPresenterComponent } from './components/views/lazy-presenter/lazy-presenter.component';
import { LoadingBarComponent } from './components/views/loading-bar/loading-bar.component';
import { DisplayFourOFourComponent } from './components/views/display-four-o-four/display-four-o-four.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pathways', component: PathwaysComponent },
  { path: 'programs', component: CoursesComponent },
  { path: 'universities', component: UniversitiesComponent },
  { path: 'pathways/:id', component: PathwaySingleComponent },
  { path: 'universities/:id', component: UniversitySingleComponent },
  { path: 'programs/:id', component: CourseSingleComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    PathwaysComponent,
    CoursesComponent,
    UniversitiesComponent,
    PathwaySingleComponent,
    UniversitySingleComponent,
    AboutFooterComponent,
    CourseSingleComponent,
    LazyPresenterComponent,
    LoadingBarComponent,
    DisplayFourOFourComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    MarkdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
