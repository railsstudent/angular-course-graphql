import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Course, CourseGQL, Lesson } from '../../generated/graphql';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  course: Course | undefined | null = undefined;
  lessons: Lesson[] | undefined | null = undefined;

  constructor(private route: ActivatedRoute, private courseGQL: CourseGQL, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const args = {
      offset: 0,
      limit: 10,
    };

    this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = params.get('id');
        if (courseId) {
          return this.courseGQL.watch({
            courseId,
            args
          }, {
            pollInterval: environment.pollingInterval
          })
          .valueChanges;
        }
        return EMPTY;
      }),
      map(({ data }) => data.course),
      takeUntil(this.destroy$)
    ).subscribe(course => {
      this.course = course;
      this.lessons = course?.lessons;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
