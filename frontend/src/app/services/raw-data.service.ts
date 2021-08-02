import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { Result, ResultSuccess } from '../models/result';
import { University } from '../models/university';
import { Course, MiniCourse } from '../models/course';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class RawDataService {

  universitiesUrl = '/api/university/';
  coursesUrl = '/api/course/';
  coursesMinifiedUrl = '/api/course/minified/';
  categoryUrl = '/api/category/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  limitOffsetParams(limit: number, offset: number): HttpParams {
    return new HttpParams()
      .set('limit', limit)
      .set('offset', offset);
  }

  private getObservable<T>(url: string, params: HttpParams = null): Observable<T> {
    return this.http.get<T>(url, { params });
  }

  constructor(private http: HttpClient) { }


  // Universities Calls
  getUniversities(limit: number, offset: number): Observable<ResultSuccess<University[]>> {
    return this.getObservable<ResultSuccess<University[]>>(this.universitiesUrl, this.limitOffsetParams(limit, offset));
  }

  getUniversity(id: number): Observable<ResultSuccess<University>> {
    return this.getObservable<ResultSuccess<University>>(this.universitiesUrl + id);
  }

  searchUniversity(query: string, limit: number, offset: number): Observable<ResultSuccess<University[]>> {
    let params = this.limitOffsetParams(limit, offset)
      .set('name', query);
    
    return this.getObservable<ResultSuccess<University[]>>(this.universitiesUrl + 'search', params);
  }

  getRandomUniversities(limit: number, offset: number): Observable<ResultSuccess<University[]>> {
    return this.getObservable<ResultSuccess<University[]>>(this.universitiesUrl + 'random', this.limitOffsetParams(limit, offset));
  }

  // Course Calls
  getCourses(limit: number, offset: number): Observable<ResultSuccess<Course[]>> {
    return this.getObservable<ResultSuccess<Course[]>>(this.coursesUrl, this.limitOffsetParams(limit, offset));
  }

  getCourse(id: number): Observable<ResultSuccess<Course>> {
    return this.getObservable<ResultSuccess<Course>>(this.coursesUrl + id);
  }

  getRandomCourses(limit: number, offset: number): Observable<ResultSuccess<Course[]>> {
    return this.getObservable<ResultSuccess<Course[]>>(this.coursesUrl + 'random', this.limitOffsetParams(limit, offset));
  }

  searchCourse(query: string, limit: number, offset: number): Observable<ResultSuccess<Course[]>> {
    let params = this.limitOffsetParams(limit, offset)
      .set('title', query);

      return this.getObservable<ResultSuccess<Course[]>>(this.coursesUrl + 'search', params);
  }

  // Minified Courses
  getMinifiedCourses(limit: number, offset: number): Observable<ResultSuccess<MiniCourse[]>> {
    return this.getObservable<ResultSuccess<MiniCourse[]>>(this.coursesMinifiedUrl, this.limitOffsetParams(limit, offset));
  }
  
  getSpecificMinifiedCourses(...ids: number[]): Observable<ResultSuccess<MiniCourse[]>> {
    let params = ids.reduce( (params, id) => params.append('ids', id), new HttpParams() );
    return this.getObservable<ResultSuccess<MiniCourse[]>>(this.coursesMinifiedUrl + 'specific', params);
  }

  getMinifiedCourseForCategory(categoryId: number): Observable<ResultSuccess<MiniCourse[]>> {
    return this.getObservable<ResultSuccess<MiniCourse[]>>(this.coursesMinifiedUrl + categoryId);
  }

  getMinifiedCourseForUniversity(universityId: number): Observable<ResultSuccess<MiniCourse[]>> {
    return this.getObservable<ResultSuccess<MiniCourse[]>>(this.coursesMinifiedUrl + 'university/' + universityId);
  }  

  getRandomMinifiedCourses(limit: number, offset: number): Observable<ResultSuccess<MiniCourse[]>> {
    return this.getObservable<ResultSuccess<MiniCourse[]>>(this.coursesMinifiedUrl + 'random', this.limitOffsetParams(limit, offset));
  }

  // Category Calls
  getCategories(limit: number, offset: number): Observable<ResultSuccess<Category[]>> {
    return this.getObservable<ResultSuccess<Category[]>>(this.categoryUrl, this.limitOffsetParams(limit, offset));
  }

  getCategory(id: number): Observable<ResultSuccess<Category>> {
    return this.getObservable<ResultSuccess<Category>>(this.categoryUrl + id);
  }

  searchCategory(query: string, limit: number, offset: number): Observable<ResultSuccess<Category[]>> {
    let params = this.limitOffsetParams(limit, offset)
      .set('title', query);

      return this.getObservable<ResultSuccess<Category[]>>(this.categoryUrl + 'search', params);
  }

  getRandomCategories(limit: number, offset: number): Observable<ResultSuccess<Category[]>> {
    return this.getObservable<ResultSuccess<Category[]>>(this.categoryUrl + 'random', this.limitOffsetParams(limit, offset));
  }
}
