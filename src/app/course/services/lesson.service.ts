import { LessonGQL } from './../../generated/graphql';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AddLessonGQL, AddLessonInput } from 'src/app/generated/graphql';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private addLessonGQL: AddLessonGQL, private lessonGQL: LessonGQL) { }

  /* TODO: optimistic updates */
  addLesson(newLesson: AddLessonInput): any {
    console.log('newLesson', newLesson);
    return this.addLessonGQL.mutate({
      newLesson
    })
    .pipe(
      map(({ data }) => data?.addLesson),
    );
  }

  getLesson(lessonId: string): any {
    return this.lessonGQL.watch({
      lessonId,
    }, {
      pollInterval: environment.pollingInterval
    })
    .valueChanges
    .pipe(
      map(({ data }) => data.lesson),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
