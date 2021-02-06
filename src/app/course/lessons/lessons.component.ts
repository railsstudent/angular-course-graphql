import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Course, Lesson } from '../../generated/graphql';
import { CourseService } from '../services';

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

  constructor(private route: ActivatedRoute, private service: CourseService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const args = {
      offset: 0,
      limit: 10,
    };

    this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = params.get('id');
        return courseId ? this.service.getCourse(courseId) : undefined;
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

  submitNewLesson(input: { name: string }): void {
    const { name } = input;
    console.log(input);
  }
}
