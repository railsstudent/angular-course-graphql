import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Lesson, Translation, Sentence, Language } from '../../generated/graphql';
import { CourseService, LessonService, SentenceService } from '../services';
import { NewSentenceInput, NewTranslationInput } from '../type';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit {
  lesson: Lesson | null | undefined = undefined;
  selectedTranslation: Translation | undefined = undefined;
  languages: Language[] | undefined = undefined;

  constructor(private route: ActivatedRoute,
              private lessonService: LessonService,
              private sentenceService: SentenceService,
              private courseService: CourseService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    const lesson$ = this.route.paramMap.pipe(
      switchMap(params => {
        const lessonId = params.get('lessonId');
        return lessonId ? this.lessonService.getLesson(lessonId) : EMPTY;
      })
    );
    const langs$ = this.courseService.getLanguages();

    combineLatest([lesson$, langs$])
      .subscribe({
        next: ([lesson, languages]: any) => {
          this.lesson = lesson as Lesson;
          const language = lesson?.course?.language;
          this.languages = language ? languages.filter((item: Language) => item.id !== language.id) : languages;
          this.cdr.markForCheck();
        },
        error: (err) => alert(err)
      });
  }

  trackByFunc(index: number, sentence: Sentence): string {
    return sentence.id;
  }

  submitNewSentence(newInput: NewSentenceInput): void {
    const { text } = newInput;

    if (this.lesson) {
      this.sentenceService
        .addSentence(this.lesson, { text, lessonId: this.lesson.id })
        .subscribe({
          next: (addSentence: Sentence) => {
            if (addSentence) {
              alert(`${addSentence.text} is added.`);
            }
          },
          error: (err: Error) => alert(err)
        });
    }
  }

  submitNewTranslation(newInput: NewTranslationInput): void {
    if (newInput && this.lesson) {
      const sentence = (this.lesson?.sentences || []).find(s => s.id === newInput.sentenceId);
      if (!sentence) {
        alert('Sentence does not exist');
        return;
      }
      this.sentenceService
        .addTranslate(sentence, newInput)
        .subscribe({
          next: (addTranslation: Translation) => {
            if (addTranslation) {
              alert(`${addTranslation.text} is added.`);
            }
          },
          error: (err: Error) => alert(err)
        });
    }
  }
}
