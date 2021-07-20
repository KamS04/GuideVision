import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PathwaysComponent } from './components/pathways/pathways.component';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses/courses.component';
import { UniversitiesComponent } from './components/universities/universities.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pathways', component: PathwaysComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'universities', component: UniversitiesComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    PathwaysComponent,
    CoursesComponent,
    UniversitiesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
