import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from '@apollo/client/core';
import { AllCoursesGQL, Course } from '../../generated/graphql';
import { tap, takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] | undefined | null = [];
  destroy$ = new Subject<boolean>();

  constructor(private allCoursesGQL: AllCoursesGQL) { }

  ngOnInit(): void {
    console.log('CourseListComponent ngOnInit');
    this.allCoursesGQL.watch({}, { pollInterval: 500 })
      .valueChanges
      .pipe(
        map(({ data }) => data.courses),
        takeUntil(this.destroy$)
      ).subscribe(courses => this.courses = courses);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
