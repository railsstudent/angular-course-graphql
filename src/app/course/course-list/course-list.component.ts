import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { Course, Language } from '../../generated/graphql';
import { CourseService, AlertService } from '../services';
import { NewCourseInput } from '../type';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent implements OnInit {
  languages$!: Observable<Language[]>;
  errMsg$!: Observable<string>;
  successMsg$!: Observable<string>;
  courses$!: Observable<Course[]>;

  constructor(private service: CourseService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.courses$ = this.service.getAllCourses({
      offset: 0,
      limit: 3
    });
    this.languages$ = this.service.getLanguages();
    this.errMsg$ = this.alertService.errMsg$;
    this.successMsg$ = this.alertService.successMsg$;
  }

  trackByFunc(index: number, course: Course): string {
    return course.id;
  }

  submitNewCourse(newCourse: NewCourseInput): void {
    this.service.addCourse(newCourse)
      .subscribe();
  }

  loadMore(): void {

  }
}
