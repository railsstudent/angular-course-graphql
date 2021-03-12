import { NewCourseInput } from './../type';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Course, Language } from '../../generated/graphql';
import { CourseService } from '../services';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent implements OnInit {
  courses: Course[] | undefined | null = [];
  languages: Language[] = [];

  constructor(private service: CourseService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.getAllCourses()
      .subscribe({
        next: (courses: Course[]) => {
          this.courses = courses;
          this.cdr.markForCheck();
        }
      });

    this.service.getLanguages()
      .subscribe({
        next: (languages: Language[]) => {
          this.languages = languages;
          this.cdr.markForCheck();
        }
      });
  }

  trackByFunc(index: number, course: Course): string {
    return course.id;
  }

  submitNewCourse(newCourse: NewCourseInput): void {
    this.service.addCourse(newCourse)
    .subscribe({
      next: (addCourse: Course | undefined | null) => {
        if (addCourse) {
          alert(`${addCourse.name} is added.`);
        }
      },
      error: (err: Error) => alert(err)
    });
  }
}
