import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../generated/graphql';
import { CourseService } from '../services';
import { NewCourseInput } from '../type';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent implements OnInit {
  courses: Course[] | undefined | null = [];
  languages$!: any;
  errMsg$!: Observable<string>;
  successMsg$!: Observable<string>;

  constructor(private service: CourseService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.getAllCourses()
      .subscribe({
        next: (courses: Course[]) => {
          this.courses = courses;
          this.cdr.markForCheck();
        }
      });

    this.languages$ = this.service.getLanguages();
    this.errMsg$ = this.service.errMsg$;
    this.successMsg$ = this.service.successMsg$;
  }

  trackByFunc(index: number, course: Course): string {
    return course.id;
  }

  submitNewCourse(newCourse: NewCourseInput): void {
    this.service.addCourse(newCourse)
      .subscribe();
  }
}
