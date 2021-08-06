import { Component, Input } from '@angular/core';
import { MiniCourse } from 'src/app/models/course';

@Component({
  selector: 'app-course-card-view',
  templateUrl: './course-card-view.component.html',
})
export class CourseCardViewComponent {
  @Input() course: MiniCourse;

  constructor() { }
}
