import { EventEmitter, Injectable } from '@angular/core';
import { Course } from '../models/course';
import { COMPARE_LIMIT, COMPARE_LIST_KEY } from '../utils/config';
import { contract } from '../utils/observable';
import { RawDataService } from './raw-data.service';

@Injectable({
  providedIn: 'root'
})
export class CompareDataService {

  private compareList: Course[];
  public compareListChanged: EventEmitter<number> = new EventEmitter();

  public get canAddMore(): boolean {
    return this.compareList.length < COMPARE_LIMIT;
  }

  constructor(
    private _Database: RawDataService,
  ) {
    this.reloadSession();

    this.compareListChanged.subscribe( (_) => {
      let compareJSON = JSON.stringify(this.compareList);
      localStorage.setItem(COMPARE_LIST_KEY, compareJSON);
    } )
  }

  public async addCourse(course: Course | number) {
    let courseToAdd: Course = null;
    if (typeof(course) == 'number') {
      try {
        let data = await contract( this._Database.getCourse(course) );
        courseToAdd = data.data;
      } catch(err) {
        // TODO Error Handling
        console.error(err);
      }
    } else {
      courseToAdd = course;
    }

    if (courseToAdd !== null) {
      this.pushCourse(courseToAdd);
    }
  }

  async reloadSession() {
    let rawLastSession = localStorage.getItem(COMPARE_LIST_KEY);
    
    if (rawLastSession !== undefined) {
      let lastSession = JSON.parse(rawLastSession);
      if (!Array.isArray(lastSession)) {
        // TODO No Idea
        return;
      }

      let promises = lastSession.map( (course: Course | number) => this.addCourse(course) );
      await Promise.all(promises);
      // TODO Display Reload Success
    }
  }

  private pushCourse(course: Course) {
    this.compareList.push(course);
    this.compareListChanged.emit(this.compareList.length);
  }

  public clearList() {
    this.compareList = [];
    this.compareListChanged.emit(0);
  }

}
