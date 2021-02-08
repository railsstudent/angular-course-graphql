import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Course, Lesson } from '../../generated/graphql';
import { NewLessonInput } from './../type';
import { CourseService, LessonService } from '../services';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsComponent implements OnInit {
  course: Course | undefined | null = undefined;
  lessons: Lesson[] | undefined | null = undefined;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private lessonService: LessonService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = params.get('id');
        return courseId ? this.courseService.getCourse(courseId) : undefined;
      }),
    ).subscribe((course: any) => {
      this.course = course as Course;
      this.lessons = course?.lessons || [];
      this.cdr.markForCheck();
    }, (err: Error) => alert(err));
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
