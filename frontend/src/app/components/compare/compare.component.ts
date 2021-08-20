import { Component, OnInit } from '@angular/core';
import { Program } from 'src/app/models/program';
import { University } from 'src/app/models/university';
import { CompareDataService } from 'src/app/services/compare-data.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  selectedItems: Map<Program, University>;
  numberOfPrograms: number = 0;
  universitiesMap: Map<number, University>;

  constructor(
    private _CompareList: CompareDataService,
  ) {
    this.getCompareList();
  }

  public get selectedPrograms(): Program[] {
    return Array.from(this.selectedItems.keys());
  }  

  ngOnInit(): void {
    this._CompareList.compareMapChanged.subscribe( (length) => {
      console.log(length);
      this.getCompareList();
    });
  }

  getCompareList() {
    this.selectedItems = this._CompareList.getCompareMap();
    this.numberOfPrograms = this._CompareList.mapSize;
    this.universitiesMap = Array.from(this.selectedItems.entries()).reduce( (map, [program, uni]) => {
      map.set(program.id, uni);
      return map;
    }, new Map<number, University>()
    )
  }

  remove(program, event) {
    this._CompareList.removeProgram(program);
    event.target.blur();
  }

  getIcon(program: Program): String {
    return this.universitiesMap.get(program.id).iconUrl;
  }

  getUniMap(program: Program): String {
    return this.universitiesMap.get(program.id).name;
  }
}
