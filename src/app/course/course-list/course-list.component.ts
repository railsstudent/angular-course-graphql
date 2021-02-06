import { NewCourseInput } from './../type';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Course, Language } from '../../generated/graphql';
import { switchMap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] | undefined | null = [];
  destroy$ = new Subject<boolean>();
  languages: Language[] = [];

  constructor(private service: CourseService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.getAllCourses()
      .subscribe((courses: Course[]) => {
        this.courses = courses;
        this.cdr.markForCheck();
      });

    this.service.getLanguages()
      .subscribe((languages: Language[]) => {
        this.languages = languages;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  trackByFunc(index: number, course: Course): string {
    return course.id;
  }

  submitNewCourse(newCourse: NewCourseInput): void {
    this.service.addCourse(newCourse)
    .subscribe((addCourse: Course | undefined | null) => {
      if (addCourse) {
        this.courses = this.courses ? [...this.courses, addCourse] : [addCourse];
        this.cdr.markForCheck();
        alert(`${addCourse.name} is added.`);
      }
    }, (err: Error) => alert(err));
  }
}
