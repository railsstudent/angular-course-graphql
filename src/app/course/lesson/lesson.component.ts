import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { Lesson, Translation, Sentence, Language } from '../../generated/graphql';
import { AlertService, CourseService, LessonService, SentenceService } from '../services';
import { NewSentenceInput, NewTranslationInput } from '../type';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit {
  selectedTranslation: Translation | undefined = undefined;
  languages: Language[] | undefined = undefined;
  errMsg$!: Observable<string>;
  successMsg$!: Observable<string>;
  translationLanguages$!: Observable<Language[]>;
  lesson$: Observable<Lesson> | null = null;

  constructor(private route: ActivatedRoute,
              private lessonService: LessonService,
              private sentenceService: SentenceService,
              private courseService: CourseService,
              private cdr: ChangeDetectorRef,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.errMsg$ = this.alertService.errMsg$;
    this.successMsg$ = this.alertService.successMsg$;

    const lesson$ = this.route.paramMap.pipe(
      switchMap(params => {
        const lessonId = params.get('lessonId');
        return lessonId ? this.lessonService.getLesson(lessonId) : EMPTY;
      })
    );
    const langs$ = this.courseService.getLanguages();

    const lessonLangs$ = combineLatest([lesson$, langs$])
      .pipe(
        map(([lesson, langs]) => ({
          lesson,
          langs
        }))
      );

    this.lesson$ = lessonLangs$.pipe(pluck('lesson'));

    lessonLangs$
      .subscribe({
        next: ({lesson, langs}: any) => {
          const language = lesson?.course?.language;
          this.languages = language ? langs.filter((item: Language) => item.id !== language.id) : langs;
          this.cdr.markForCheck();
        },
        error: (err: Error) => alert(err.message)
      });
  }

  trackByFunc(index: number, sentence: Sentence): string {
    return sentence.id;
  }

  submitNewSentence(lesson: Lesson, newInput: NewSentenceInput): void {
    const { text } = newInput;

    if (lesson) {
      this.sentenceService
        .addSentence(lesson, { text, lessonId: lesson.id })
        .subscribe();
    }
  }

  submitNewTranslation(lesson: Lesson, newInput: NewTranslationInput): void {
    if (newInput && lesson) {
      const sentence = (lesson?.sentences || []).find(s => s.id === newInput.sentenceId);
      if (!sentence) {
        alert('Sentence does not exist');
        return;
      }
      this.sentenceService
        .addTranslate(sentence, newInput)
        .subscribe();
    }
  }
}
