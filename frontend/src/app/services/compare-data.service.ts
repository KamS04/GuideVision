import { EventEmitter, Injectable } from '@angular/core';
import { Program } from '../models/program';
import { University } from '../models/university';
import { COMPARE_LIMIT, COMPARE_LIST_KEY } from '../utils/config';
import { contract } from '../utils/observable';
import { isInstanceOf } from '../utils/type';
import { RawDataService } from './raw-data.service';

@Injectable({
  providedIn: 'root'
})
export class CompareDataService {

  private compareMap= new Map<Program, University>();
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

  public async addProgram(program: Program | number, university?: University) {
    if (this.compareMap.size >= COMPARE_LIMIT) {
      return;
    }

    let programToAdd: Program = null;
    if (typeof(program) == 'number') {
      try {
        let data = await contract( this._Database.getProgram(program) );
        programToAdd = data.data;
      } catch(err) {
        // TODO Error Handling
        console.error(err);
      }
    } else {
      programToAdd = program;
    }

    if (programToAdd !== null) {
      this.pushProgram(programToAdd, university);

      if (university === undefined) {
        try {
          let data = await contract( this._Database.getUniversity(programToAdd.universityId) );
          this.updateProgram(programToAdd, data.data);
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

      if (!data.every( ([c, u]) => isInstanceOf(c, Program) && isInstanceOf(u, University))) {
        return
      }

      let promises = data.map ( ([program, university]) => this.addProgram(program, university) );

      await Promise.all(promises);
      // TODO Display Reload Success
    }
  }

  private pushProgram(program: Program, university?: University) {
    this.compareMap.set(program, university);
    this.compareMapChanged.emit();
  }

  private updateProgram(program: Program, university: University) {
    if (this.compareMap.has(program)) {
      this.compareMap.set(program, university)
      this.compareMapChanged.emit();
    }
  }

  public clearMap() {
    this.setMap(new Map());
  }

  public setMap(newMap: Map<Program, University>) {
    this.compareMap = newMap;
    this.compareMapChanged.emit();
  }

  public removeProgram(program: Program | number) {
    let programId = typeof(program) == 'number' ? program : program.id;
      
    let toDelete = Array.from(this.compareMap.keys()).filter( (pProgram) => pProgram.id == programId )
    if (toDelete.length > 0) {
      toDelete.forEach( (it) => this.compareMap.delete(it))
      this.compareMapChanged.emit();
    }
  }

  public isAddedAlready(program: Program | number): boolean {
    if (program instanceof Program) {
      return this.compareMap.has(program);
    } else {
      return Array.from(this.compareMap.keys()).some( (it) => it.id == program );
    }
  }

  public getCompareMap(): Map<Program, University> {
    return new Map(this.compareMap);
  }

  public get mapSize(): number {
    return this.compareMap.size;
  }

}
