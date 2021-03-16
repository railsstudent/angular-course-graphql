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
import { AddSentenceComponent } from './add-sentence/add-sentence.component';
import { AddTranslationComponent } from './add-translation/add-translation.component';
import { SentenceComponent } from './sentence/sentence.component';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [CourseListComponent,
    CourseCardComponent,
    LessonsComponent,
    LessonComponent,
    AddCourseComponent,
    AddLessonComponent,
    AddSentenceComponent,
    AddTranslationComponent,
    SentenceComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class CourseModule { }
