import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseRoutingModule } from './course-routing.module';
import { CourseCardComponent } from './course-card/course-card.component';

@NgModule({
  declarations: [CourseListComponent, CourseCardComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
  ]
})
export class CourseModule { }
