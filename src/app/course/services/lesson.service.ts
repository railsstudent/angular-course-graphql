import { Injectable, OnDestroy } from '@angular/core';
import { Subject, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AddLessonGQL, AddLessonInput } from 'src/app/generated/graphql';
import { environment } from 'src/environments/environment';
import { NewLessonInput } from '../type';

@Injectable({
  providedIn: 'root'
})
export class LessonService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private addLessonGQL: AddLessonGQL) { }

  /* TODO: optimistic updates */
  addLesson(newLesson: AddLessonInput): any {
    return this.addLessonGQL.mutate({
      newLesson
    })
    .pipe(
      map(({ data }) => data?.addLesson),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
