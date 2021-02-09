import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Lesson, Translation, Sentence, Language } from '../../generated/graphql';
import { CourseService, LessonService, SentenceService } from '../services';
import { NewSentenceInput, NewTranslationInput } from '../type';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  sentence$ = new Subject<string>();
  translationLangauge$ = new Subject<string>();
  lesson: Lesson | null | undefined = undefined;
  selectedTranslation: Translation | undefined = undefined;
  language: Language | undefined = undefined;
  languages: Language[] | undefined = undefined;

  constructor(private route: ActivatedRoute,
              private lessonService: LessonService,
              private sentenceService: SentenceService,
              private courseService: CourseService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const lessonId = params.get('lessonId');
        return lessonId ? this.lessonService.getLesson(lessonId) : EMPTY;
      }),
    ).subscribe((lesson: any) => {
      this.lesson = lesson as Lesson;
      this.cdr.markForCheck();
    }, (err) => alert(err));

    this.courseService.getLanguages()
      .subscribe((languages: Language[]) => {
        this.languages = languages;
        this.cdr.markForCheck();
      });

    combineLatest([this.sentence$, this.translationLangauge$])
      .pipe(
        switchMap(([sentenceId, languageId]) =>
          this.sentenceService.getTranslation(sentenceId, languageId)
        ),
        takeUntil(this.destroy$)
      ).subscribe((translation: any) => {
        this.selectedTranslation = translation as Translation;
        this.cdr.markForCheck();
      }, (err) => alert(err));
  }

  showTranslation(sentence: Sentence, availableTranslation: Language): void {
    this.sentence$.next(sentence?.id);
    this.translationLangauge$.next(availableTranslation?.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  trackByFunc(index: number, sentence: Sentence): string {
    return sentence.id;
  }

  submitNewSentence(newInput: NewSentenceInput): void {
    const { text } = newInput;

    if (this.lesson) {
      this.sentenceService
        .addSentence({ text, lessonId: this.lesson.id })
        .subscribe((addSentence: Sentence) => {
          if (this.lesson) {
            const sentences = this.lesson.sentences ? [...this.lesson.sentences, addSentence] : [addSentence];
            this.lesson = {
              ...this.lesson,
              sentences,
            };
            this.cdr.markForCheck();
            alert(`${addSentence.text} is added.`);
          }
        }, (err: Error) => alert(err));
    }
  }

  submitNewTranslation(newInput: NewTranslationInput): void {
    if (newInput) {
      // this.sentenceService
      //   .addSentence({ text, lessonId: this.lesson.id })
      //   .subscribe((addSentence: Sentence) => {
      //     if (this.lesson) {
      //       const sentences = this.lesson.sentences ? [...this.lesson.sentences, addSentence] : [addSentence];
      //       this.lesson = {
      //         ...this.lesson,
      //         sentences,
      //       };
      //       this.cdr.markForCheck();
      //       alert(`${addSentence.text} is added.`);
      //     }
      //   }, (err: Error) => alert(err));
    }
  }
}
