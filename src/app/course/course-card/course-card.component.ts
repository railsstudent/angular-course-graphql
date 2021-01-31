import { Component, Input, OnInit } from '@angular/core';
import { Course } from '../../generated/graphql';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  @Input()
  course: Course | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
  }

  viewLesson(): void {
    console.log('View lessons');
  }
}
