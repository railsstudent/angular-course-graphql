import { Injectable, OnDestroy } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AllCoursesGQL, LanguagesGQL, AddCourseGQL, Course } from '../../generated/graphql';
import { NewCourseInput } from '../type';

@Injectable({
  providedIn: 'root'
})
export class CourseService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private allCoursesGQL: AllCoursesGQL,
              private languagesGQL: LanguagesGQL,
              private addCourseGQL: AddCourseGQL, ) { }

  addCourse(newCourse: NewCourseInput): any {
    return this.addCourseGQL.mutate({
      newCourse
    })
    .pipe(
      map(({ data }) => of(data?.addCourse)),
      catchError(err => {
        console.error(err);
        return of(err?.message || 'Add course error');
      }),

    );
  }

  getLanguages(): any {
    return this.languagesGQL.watch({})
      .valueChanges
      .pipe(
        map(({ data }) => data.getLanguages),
        takeUntil(this.destroy$)
      );
  }

  getAllCourses(): any {
    return this.allCoursesGQL.watch({}, { pollInterval: environment.pollingInterval })
      .valueChanges
      .pipe(
        map(({ data }) => data.courses),
        catchError(err => {
          console.error(err);
          return of([] as Course[]);
        }),
        takeUntil(this.destroy$)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
