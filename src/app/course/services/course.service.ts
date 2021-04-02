import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { EMPTY, of, Observable } from 'rxjs';
import { catchError, map, share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AllCoursesGQL, LanguagesGQL, AddCourseGQL, Course, CourseGQL, Language, AllCoursesDocument,
  AllCoursesQuery, CursorPaginationArgs, NextLessonsGQL, Lesson, PaginatedItems } from '../../generated/graphql';
import { NewCourseInput } from '../type';
import { AlertService } from './alert.service';

export const LIMIT = 2;
const INIT_ARGS: CursorPaginationArgs = {
  cursor: -1,
  limit: LIMIT
};

export const LESSON_LIMIT = 3;
const INIT_LESSON_ARGS: CursorPaginationArgs = {
  cursor: -1,
  limit: LESSON_LIMIT
};

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private allCoursesGQL: AllCoursesGQL,
              private languagesGQL: LanguagesGQL,
              private courseGQL: CourseGQL,
              private addCourseGQL: AddCourseGQL,
              private nextLessonGQL: NextLessonsGQL,
              private alertService: AlertService,
              private apollo: Apollo) { }

  addCourse(newCourse: NewCourseInput): Observable<Course> {
    this.alertService.clearMsgs();
    return this.addCourseGQL.mutate({
      newCourse
    }, {
      update: (cache, {data}) => {
        const query = this.allCoursesGQL.document;
        const returnedCourse = data?.addCourse;
        const queryOptions = {
          query,
          variables: {
            args: INIT_ARGS
          }
        };

        const { courses: cacheCourses = null }: any = cache.readQuery(queryOptions);
        const { cursor = -1, courses: existingCourses = [] } = cacheCourses;
        const courses = {
          cursor,
          courses: existingCourses ? [...existingCourses, returnedCourse] : [returnedCourse]
        };
        cache.writeQuery({
          ...queryOptions,
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
    return this.courseGQL.watch({
      courseId,
      args: INIT_LESSON_ARGS
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

  // getAllCourses(args: PaginationArgs): Observable<Course[]> {
  //   return this.allCoursesGQL.watch({ args }, { pollInterval: environment.pollingInterval })
  //     .valueChanges
  //     .pipe(
  //       map(({ data }) => data.courses as Course[]),
  //       catchError(err => {
  //         console.error(err);
  //         return of([] as Course[]);
  //       }),
  //     );
  // }

  getPaginatedCoursesQueryRef(): QueryRef<AllCoursesQuery>  {
    return this.apollo.watchQuery<AllCoursesQuery>({
      query: AllCoursesDocument,
      variables: {
        args: INIT_ARGS,
      },
    });
  }

  nextLessons(courseId: string, args: CursorPaginationArgs): Observable<PaginatedItems> {
    this.alertService.clearMsgs();
    return this.nextLessonGQL.mutate({
      courseId,
      args
    }, {
      update: (cache, {data}) => {
        const query = this.courseGQL.document;
        const nextLessons = (data?.nextLessons || []) as Lesson[];
        const queryOptions = {
          query,
          variables: {
            courseId,
            args: INIT_LESSON_ARGS
          }
        };
        const { paginatedLessons: prevPaginatedLessons = [] }: any = cache.readQuery(queryOptions);

        const paginatedLessons = prevPaginatedLessons ? [...prevPaginatedLessons, ...nextLessons] : [...nextLessons];
        cache.writeQuery({
          ...queryOptions,
          data: { paginatedLessons }
        });
      }
    })
    .pipe(
      map(({ data }) => data?.nextLessons as PaginatedItems),
      catchError((err: Error) => EMPTY),
    );
  }
}
