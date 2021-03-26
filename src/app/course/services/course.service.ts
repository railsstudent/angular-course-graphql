import { Injectable } from '@angular/core';
import { EMPTY, of, Observable } from 'rxjs';
import { catchError, map, share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AllCoursesGQL, LanguagesGQL, AddCourseGQL, Course, CourseGQL, Language, PaginationArgs } from '../../generated/graphql';
import { NewCourseInput } from '../type';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private allCoursesGQL: AllCoursesGQL,
              private languagesGQL: LanguagesGQL,
              private courseGQL: CourseGQL,
              private addCourseGQL: AddCourseGQL,
              private alertService: AlertService) { }

  addCourse(newCourse: NewCourseInput): Observable<Course> {
    this.alertService.clearMsgs();
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
      map(({ data }) => data?.addCourse as Course),
      tap((addCourse: Course) => this.alertService.setSuccess(`${addCourse.name} is added.`)),
      catchError((err: Error) => {
        this.alertService.setError(err.message);
        return EMPTY;
      }),
    );
  }

  getCourse(courseId: string): Observable<Course> {
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
      map(({ data }) => data.course as Course),
      catchError(err => {
        this.alertService.setError(err.message);
        return EMPTY;
      }),
    );
  }

  getLanguages(): Observable<Language[]> {
    return this.languagesGQL.watch({})
      .valueChanges
      .pipe(
        map(({ data }) => data.getLanguages),
        catchError(err => {
          console.error(err);
          return of([] as Language[]);
        }),
        share(),
      );
  }

  getAllCourses(args: PaginationArgs): Observable<Course[]> {
    return this.allCoursesGQL.watch({ args }, { pollInterval: environment.pollingInterval })
      .valueChanges
      .pipe(
        map(({ data }) => data.courses as Course[]),
        catchError(err => {
          console.error(err);
          return of([] as Course[]);
        }),
      );
  }

  fetchMoreCourses(args: PaginationArgs) {
    return this.allCoursesGQL.fetch({
      args
    }, {
      // updateQuery: () => {
      // }
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return prev; }
        return Object.assign({}, prev, {
          feed: [...prev.feed, ...fetchMoreResult.feed],
        });
      }
    }).pipe()
  }
}
