import { CourseGQL } from './../../generated/graphql';
import { Injectable, OnDestroy } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AllCoursesGQL, LanguagesGQL, AddCourseGQL, Course } from '../../generated/graphql';
import { NewCourseInput } from '../type';
import { AnyMxRecord } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class CourseService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private allCoursesGQL: AllCoursesGQL,
              private languagesGQL: LanguagesGQL,
              private courseGQL: CourseGQL,
              private addCourseGQL: AddCourseGQL, ) { }

  addCourse(newCourse: NewCourseInput): any {
    return this.addCourseGQL.mutate({
      newCourse
    }, {
      update: (cache, {data}) => {
        const query = this.allCoursesGQL.document;
        const returnedCourse = data?.addCourse;
        const { courses: existingCourses = [] }: any = cache.readQuery({
          query
        });

        const courses = existingCourses ? [...existingCourses, returnedCourse] : [returnedCourse];
        cache.writeQuery({
          query,
          data: { courses }
        });
      }
    })
    .pipe(
      map(({ data }) => data?.addCourse),
    );
  }

  getCourse(courseId: string): any {
    const args = {
      offset: 0,
      limit: 100,
    };

    return this.courseGQL.watch({
      courseId,
      args
    }, {
      pollInterval: environment.pollingInterval
    })
    .valueChanges
    .pipe(
      map(({ data }) => data.course),
      takeUntil(this.destroy$)
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
