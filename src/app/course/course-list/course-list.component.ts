import { NewCourseInput } from './../type';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AllCoursesGQL, Course, Language, LanguagesGQL } from '../../generated/graphql';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  constructor(private allCoursesGQL: AllCoursesGQL,
              private languagesGQL: LanguagesGQL,
              private service: CourseService,
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
    this.service.addCourse(newCourse)
    .pipe(
      switchMap((result: any) => {
        if (typeof result === 'string') {
          alert(result);
          return EMPTY;
        }
        return result;
    }))
    .subscribe((addCourse: Course | undefined | null) => {
      if (addCourse) {
        this.courses = this.courses ? [...this.courses, addCourse] : [addCourse];
        this.cdr.markForCheck();
        alert(`${addCourse.name} is added.`);
      }
    });
  }
}
