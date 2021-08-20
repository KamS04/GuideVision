import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ResultSuccess } from '../models/result';
import { University } from '../models/university';
import { Program, MiniProgram } from '../models/program';
import { Pathway } from '../models/pathway';

@Injectable({
  providedIn: 'root'
})
export class RawDataService {

  universitiesUrl = '/api/universities/';
  programsUrl = '/api/programs/';
  programsMinifiedUrl = '/api/programs/minified/';
  pathwayUrl = '/api/pathways/';

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

  // Program Calls
  getPrograms(limit: number, offset: number): Observable<ResultSuccess<Program[]>> {
    return this.getObservable<ResultSuccess<Program[]>>(this.programsUrl, this.limitOffsetParams(limit, offset));
  }

  getProgram(id: number): Observable<ResultSuccess<Program>> {
    return this.getObservable<ResultSuccess<Program>>(this.programsUrl + id);
  }

  getRandomPrograms(limit: number, offset: number): Observable<ResultSuccess<Program[]>> {
    return this.getObservable<ResultSuccess<Program[]>>(this.programsUrl + 'random', this.limitOffsetParams(limit, offset));
  }

  // Minified Programs
  getMinifiedPrograms(limit: number, offset: number): Observable<ResultSuccess<MiniProgram[]>> {
    return this.getObservable<ResultSuccess<MiniProgram[]>>(this.programsMinifiedUrl, this.limitOffsetParams(limit, offset));
  }
  
  getSpecificMinifiedPrograms(...ids: number[]): Observable<ResultSuccess<MiniProgram[]>> {
    let params = ids.reduce( (params, id) => params.append('ids', id), new HttpParams() );
    return this.getObservable<ResultSuccess<MiniProgram[]>>(this.programsMinifiedUrl + 'specific', params);
  }

  getMinifiedProgramForPathway(pathwayId: number): Observable<ResultSuccess<MiniProgram[]>> {
    return this.getObservable<ResultSuccess<MiniProgram[]>>(this.programsMinifiedUrl + 'pathway/' + pathwayId);
  }

  getMinifiedProgramForUniversity(universityId: number): Observable<ResultSuccess<MiniProgram[]>> {
    return this.getObservable<ResultSuccess<MiniProgram[]>>(this.programsMinifiedUrl + 'university/' + universityId);
  }  

  getRandomMinifiedPrograms(limit: number, offset: number): Observable<ResultSuccess<MiniProgram[]>> {
    return this.getObservable<ResultSuccess<MiniProgram[]>>(this.programsMinifiedUrl + 'random', this.limitOffsetParams(limit, offset));
  }

  searchProgram(query: string, limit: number, offset: number): Observable<ResultSuccess<MiniProgram[]>> {
    let params = this.limitOffsetParams(limit, offset)
      .set('title', query);

      return this.getObservable<ResultSuccess<MiniProgram[]>>(this.programsUrl + 'search', params);
  }

  // Pathway Calls
  getPathways(limit: number, offset: number): Observable<ResultSuccess<Pathway[]>> {
    return this.getObservable<ResultSuccess<Pathway[]>>(this.pathwayUrl, this.limitOffsetParams(limit, offset));
  }

  getPathway(id: number): Observable<ResultSuccess<Pathway>> {
    return this.getObservable<ResultSuccess<Pathway>>(this.pathwayUrl + id);
  }

  searchPathway(query: string, limit: number, offset: number): Observable<ResultSuccess<Pathway[]>> {
    let params = this.limitOffsetParams(limit, offset)
      .set('title', query);

      return this.getObservable<ResultSuccess<Pathway[]>>(this.pathwayUrl + 'search', params);
  }

  getRandomPathways(limit: number, offset: number): Observable<ResultSuccess<Pathway[]>> {
    return this.getObservable<ResultSuccess<Pathway[]>>(this.pathwayUrl + 'random', this.limitOffsetParams(limit, offset));
  }
}
