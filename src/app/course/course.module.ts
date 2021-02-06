import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseRoutingModule } from './course-routing.module';
import { CourseCardComponent } from './course-card/course-card.component';
import { LessonsComponent } from './lessons/lessons.component';
import { LessonComponent } from './lesson/lesson.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { AddLessonComponent } from './add-lesson/add-lesson.component';

@NgModule({
  declarations: [CourseListComponent, CourseCardComponent, LessonsComponent, LessonComponent, AddCourseComponent, AddLessonComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class CourseModule { }
