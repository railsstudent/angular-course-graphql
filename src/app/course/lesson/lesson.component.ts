import { Lesson } from './../../generated/graphql';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LessonGQL } from '../../generated/graphql';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  lesson: Lesson | null | undefined = undefined;

  constructor(private route: ActivatedRoute, private lessonGQL: LessonGQL, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const lessonId = params.get('lessonId');
        if (lessonId) {
          return this.lessonGQL.watch({
            lessonId,
          }, {
            pollInterval: environment.pollingInterval
          })
          .valueChanges;
        }
        return EMPTY;
      }),
      map(({ data }) => data.lesson),
      takeUntil(this.destroy$)
    ).subscribe(lesson => {
      this.lesson = lesson;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
