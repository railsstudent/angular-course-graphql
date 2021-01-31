import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './course/course-list/course-list.component';

const routes: Routes = [
  {
    path: 'courses',
    loadChildren: () => import('./course/course.module').then(m => m.CourseModule)
  },
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full'
  },
  { path: '**', component: CourseListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
