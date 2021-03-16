import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Course, Lesson } from '../../generated/graphql';
import { NewLessonInput } from './../type';
import { AlertService, CourseService, LessonService } from '../services';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsComponent implements OnInit {
  errMsg$!: Observable<string>;
  successMsg$!: Observable<string>;
  course$!: Observable<Course | undefined>;
  lessons$!: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private lessonService: LessonService,
              private alertService: AlertService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.course$ = this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = params.get('id');
        return courseId ? this.courseService.getCourse(courseId) : of (undefined);
      }),
    );
    this.lessons$ = this.course$.pipe(map(course => course?.lessons || []));
    this.errMsg$ = this.alertService.errMsg$;
    this.successMsg$ = this.alertService.successMsg$;
  }

  trackByFunc(index: number, lesson: Lesson): string {
    return lesson.id;
  }

  submitNewLesson(course: Course, input: NewLessonInput): void {
    const { name } = input;
    if (course) {
      this.lessonService.addLesson(course, {
        name,
        courseId: course.id
      })
      .subscribe();
    }
  }
}
