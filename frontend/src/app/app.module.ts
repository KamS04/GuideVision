import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PathwaysComponent } from './components/pathways/pathways.component';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses/courses.component';
import { UniversitiesComponent } from './components/universities/universities.component';
import { NgbdCarouselPause } from './components/ngbd-carousel-pause/ngbd-carousel-pause.component';
import { PathwaySingleComponent } from './components/pathway-single/pathway-single.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pathways', component: PathwaysComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'universities', component: UniversitiesComponent },
  { path: 'pathways/:id', component: PathwaySingleComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    PathwaysComponent,
    CoursesComponent,
    UniversitiesComponent,
    NgbdCarouselPause,
    PathwaySingleComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
