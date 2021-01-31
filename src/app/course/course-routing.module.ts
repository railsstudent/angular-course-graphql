import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseListComponent } from './course-list/course-list.component';
import { LessonsComponent } from './lessons/lessons.component';


const routes: Routes = [
  {
    path: '',
    component: CourseListComponent
  },
  {
    path: ':id/lessons',
    component: LessonsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
