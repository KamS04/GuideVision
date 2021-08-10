import { EventEmitter, Injectable } from '@angular/core';
import { Course } from '../models/course';
import { University } from '../models/university';
import { COMPARE_LIMIT, COMPARE_LIST_KEY } from '../utils/config';
import { contract } from '../utils/observable';
import { isInstanceOf } from '../utils/type';
import { RawDataService } from './raw-data.service';

@Injectable({
  providedIn: 'root'
})
export class CompareDataService {

  private compareMap= new Map<Course, University>();
  public compareMapChanged = new EventEmitter();

  public get canAddMore(): boolean {
    return this.compareMap.size < COMPARE_LIMIT;
  }

  constructor(
    private _Database: RawDataService,
  ) {
    this.reloadSession();

    this.compareMapChanged.subscribe( (_) => {
      let map = Array.from(this.compareMap);

      let data = { time: Date.now(), data: map };
      let compareJSON = JSON.stringify(data);
      localStorage.setItem(COMPARE_LIST_KEY, compareJSON);
    } );
  }

  public async addCourse(course: Course | number, university?: University) {
    if (this.compareMap.size >= COMPARE_LIMIT) {
      return;
    }

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
      this.pushCourse(courseToAdd, university);

      if (university === undefined) {
        try {
          let data = await contract( this._Database.getUniversity(courseToAdd.universityId) );
          this.updateCourse(courseToAdd, data.data);
        } catch (err) {
          // TODO Error Handling
          console.error(err);
        }
      }
    }
  }

  async reloadSession() {
    let rawLastSession = localStorage.getItem(COMPARE_LIST_KEY);
    
    if (rawLastSession !== undefined) {
      let lastSession = JSON.parse(rawLastSession);
      if (lastSession == undefined) {
        return;
      }

      let { time, data } = lastSession;
      if (time == undefined || data == undefined || !Array.isArray(data)) {
        return;
      }

      if (!data.every( ([c, u]) => isInstanceOf(c, Course) && isInstanceOf(u, University))) {
        return
      }

      let promises = data.map ( ([course, university]) => this.addCourse(course, university) );

      await Promise.all(promises);
      // TODO Display Reload Success
    }
  }

  private pushCourse(course: Course, university?: University) {
    this.compareMap.set(course, university);
    this.compareMapChanged.emit();
  }

  private updateCourse(course: Course, university: University) {
    if (this.compareMap.has(course)) {
      this.compareMap.set(course, university)
      this.compareMapChanged.emit();
    }
  }

  public clearMap() {
    this.setMap(new Map());
  }

  public setMap(newMap: Map<Course, University>) {
    this.compareMap = newMap;
    this.compareMapChanged.emit();
  }

  public removeCourse(course: Course | number) {
    let courseId = typeof(course) == 'number' ? course : course.id;
      
    let toDelete = Array.from(this.compareMap.keys()).filter( (cCourse) => cCourse.id == courseId )
    if (toDelete.length > 0) {
      toDelete.forEach( (it) => this.compareMap.delete(it))
      this.compareMapChanged.emit();
    }
  }

  public isAddedAlready(course: Course | number): boolean {
    if (course instanceof Course) {
      return this.compareMap.has(course);
    } else {
      return Array.from(this.compareMap.keys()).some( (it) => it.id == course );
    }
  }

  public getCompareMap(): Map<Course, University> {
    return new Map(this.compareMap);
  }

  public get mapSize(): number {
    return this.compareMap.size;
  }

}
