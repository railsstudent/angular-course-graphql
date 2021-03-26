import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AddLessonGQL, AddLessonInput, LessonGQL, Course, Lesson } from '../../generated/graphql';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(private addLessonGQL: AddLessonGQL, private lessonGQL: LessonGQL, private alertService: AlertService) { }

  addLesson(course: Course, newLesson: AddLessonInput): Observable<Lesson> {
    this.alertService.clearMsgs();
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
      map(({ data }) => data?.addLesson as Lesson),
      tap((addLesson: Lesson) => this.alertService.setSuccess(`${addLesson.name} is added.`)),
      catchError((err: Error) => {
        this.alertService.setError(err.message);
        return EMPTY;
      }),
    );
  }

  getLesson(lessonId: string): Observable<Lesson> {
    return this.lessonGQL.watch({
      lessonId,
    }, {
      pollInterval: environment.pollingInterval
    })
    .valueChanges
    .pipe(
      map(({ data }) => data.lesson as Lesson),
    );
  }
}
