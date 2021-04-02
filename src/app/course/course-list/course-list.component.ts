import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { QueryRef } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Course, Language, AllCoursesQuery } from '../../generated/graphql';
import { CourseService, AlertService, LIMIT } from '../services';
import { NewCourseInput } from '../type';

@UntilDestroy({})
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent implements OnInit {
  languages$!: Observable<Language[]>;
  errMsg$!: Observable<string>;
  successMsg$!: Observable<string>;
  courses$!: Observable<Course[]>;
  // offset = 0;
  coursesQuery!: QueryRef<AllCoursesQuery>;
  cursor = -1;

  constructor(private service: CourseService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    // this.courses$ = this.service.getAllCourses({
    //   offset: 0,
    //   limit: LIMIT
    // }).pipe(
    //   tap(results => this.offset = results.length)
    // );

    this.coursesQuery = this.service.getPaginatedCoursesQueryRef();

    this.courses$ = this.coursesQuery
      .valueChanges
      .pipe(
        map(({ data }) => data.courses),
        tap(courses => this.cursor = courses?.cursor || -1),
        map(courses => (courses?.courses || []) as Course[]),
        catchError(err => {
          console.error(err.message);
          this.cursor = -1;
          return of([] as Course[]);
        }),
      );

    this.languages$ = this.service.getLanguages();
    this.errMsg$ = this.alertService.errMsg$;
    this.successMsg$ = this.alertService.successMsg$;
  }

  trackByFunc(index: number, course: Course): string {
    return course.id;
  }

  submitNewCourse(newCourse: NewCourseInput): void {
    this.service.addCourse(newCourse)
      .subscribe();
  }

  loadMore(): void {
    this.coursesQuery.fetchMore({
      variables: {
        args: {
          cursor: this.cursor,
          limit: LIMIT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        const fetchMoreCourses =  fetchMoreResult?.courses || undefined;
        const courses = fetchMoreCourses?.courses || [] as Course[];
        const prevCourses: Course[] = prev?.courses?.courses || [];

        const allCourses = [...prevCourses, ...courses];
        const uniqCourses = allCourses.filter((c, index, self) =>
          self.map(s => s.id).indexOf(c.id) === index
        );

        return {
          ...prev,
          courses: {
            cursor: fetchMoreCourses?.cursor || -1,
            courses: uniqCourses
          }
        };
      }
    });
  }
}
