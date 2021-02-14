import { Injectable, OnDestroy } from '@angular/core';
import { gql } from 'apollo-angular';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AddLessonGQL, AddLessonInput, LessonGQL, CourseGQL, Course } from '../../generated/graphql';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private addLessonGQL: AddLessonGQL, private lessonGQL: LessonGQL, private courseGQL: CourseGQL) { }

  addLesson(course: Course, newLesson: AddLessonInput): any {
    return this.addLessonGQL.mutate({
      newLesson
    }, {
      update: (cache, { data }) => {
        const returnedLesson = data?.addLesson;

        cache.modify({
          id: cache.identify(course),
          fields: {
            lessons(existingLessonRefs = [], { readField }): any[] {
              const newLessonRef = cache.writeFragment({
                data: returnedLesson,
                fragment: gql`
                  fragment NewLesson on Lesson {
                    id
                    name
                  }
                `
              });
              // Quick safety check - if the new lesson is already
              // present in the cache, we don't need to add it again.
              if (returnedLesson && existingLessonRefs.some(
                (ref: any) => readField('id', ref) === returnedLesson.id
              )) {
                return existingLessonRefs;
              }
              return [...existingLessonRefs, newLessonRef];
            }
          }
        });
      }
    })
    .pipe(
      map(({ data }) => data?.addLesson),
      takeUntil(this.destroy$)
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
