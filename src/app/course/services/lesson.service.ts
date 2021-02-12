import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AddLessonGQL, AddLessonInput, LessonGQL, CourseGQL } from '../../generated/graphql';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private addLessonGQL: AddLessonGQL, private lessonGQL: LessonGQL, private courseGQL: CourseGQL) { }

  addLesson(newLesson: AddLessonInput): any {
    return this.addLessonGQL.mutate({
      newLesson
    }, {
      update: (cache, { data }) => {
        const args = {
          offset: 0,
          limit: 100,
        };

        const variables = {
          courseId: newLesson.courseId,
          args
        };
        const query = this.courseGQL.document;

        const options = {
          query,
          variables
        };

        const returnedLesson = data?.addLesson;
        const { course: existingCourse }: any = cache.readQuery(options);

        if (existingCourse) {
          const course = {
            ...existingCourse,
            lessons: [ ...existingCourse.lessons, returnedLesson ]
          };

          cache.writeQuery({
            ...options,
            data: { course }
          });
        }
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
