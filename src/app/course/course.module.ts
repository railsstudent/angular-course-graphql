import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseRoutingModule } from './course-routing.module';
import { CourseCardComponent } from './course-card/course-card.component';
import { LessonsComponent } from './lessons/lessons.component';

@NgModule({
  declarations: [CourseListComponent, CourseCardComponent, LessonsComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
  ]
})
export class CourseModule { }
