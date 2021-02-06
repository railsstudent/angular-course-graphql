import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Course, Lesson } from '../../generated/graphql';
import { NewLessonInput } from './../type';
import { CourseService, LessonService } from '../services';

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

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private lessonService: LessonService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const args = {
      offset: 0,
      limit: 10,
    };

    this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = params.get('id');
        return courseId ? this.courseService.getCourse(courseId) : undefined;
      }),
      takeUntil(this.destroy$)
    ).subscribe((course: any) => {
      this.course = course;
      this.lessons = course?.lessons;
      this.cdr.markForCheck();
    }, (err: Error) => alert(err));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  trackByFunc(index: number, lesson: Lesson): string {
    return lesson.id;
  }

  submitNewLesson(input: NewLessonInput): void {
    const { name } = input;
    if (this.course) {
      this.lessonService.addLesson({
        name,
        courseId: this.course.id
      })
      .subscribe((addLesson: Lesson) => {
        if (addLesson) {
          this.lessons = this.lessons ? [...this.lessons, addLesson] : [addLesson];
          this.cdr.markForCheck();
          alert(`${addLesson.name} is added.`);
        }
      }, (err: Error) => alert(err));
    }
  }
}
