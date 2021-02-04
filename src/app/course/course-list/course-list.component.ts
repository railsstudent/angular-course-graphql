import { NewCourseInput } from './../type';
import { Language, LanguagesGQL } from './../../generated/graphql';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AllCoursesGQL, Course } from '../../generated/graphql';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
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

  constructor(private allCoursesGQL: AllCoursesGQL, private languagesGQL: LanguagesGQL, private cdr: ChangeDetectorRef) { }

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

  submitNewCourse(value: NewCourseInput): void {
    console.log(value);
  }
}
