import { NewCourseInput } from './../type';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AllCoursesGQL, Course, AddCourseGQL, Language, LanguagesGQL } from '../../generated/graphql';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  constructor(private allCoursesGQL: AllCoursesGQL,
              private languagesGQL: LanguagesGQL,
              private addCourseGQL: AddCourseGQL,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.allCoursesGQL.watch({}, { pollInterval: environment.pollingInterval })
      .valueChanges
      .pipe(
        map(({ data }) => data.courses),
        takeUntil(this.destroy$)
      ).subscribe(courses => {
        this.courses = courses;
        this.cdr.markForCheck();
      });

    this.languagesGQL.watch({})
      .valueChanges
      .pipe(
        map(({ data }) => data.getLanguages),
        takeUntil(this.destroy$)
      ).subscribe(languages => {
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
    this.addCourseGQL.mutate({
      newCourse
    })
    .pipe(
      catchError(err => {
        console.error(err);
        alert(err?.message || 'Add course error');
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    )
    .subscribe(({ data }) => {
      const { addCourse } = data || {};
      if (addCourse) {
        this.courses = this.courses ? [...this.courses, addCourse] : [addCourse];
        this.cdr.markForCheck();
      }
    });
  }
}
