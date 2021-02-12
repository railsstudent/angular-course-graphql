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
  translationLanguage$ = new Subject<string>();
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

    combineLatest([lesson$, this.courseService.getLanguages()])
      .subscribe(([lesson, languages]: any) => {
        this.lesson = lesson as Lesson;
        const language = lesson?.course?.language;
        this.languages = language ? languages.filter((item: Language) => item.id !== language.id) : languages;
        this.cdr.markForCheck();
      }, (err) => alert(err));

    combineLatest([this.sentence$, this.translationLanguage$])
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
    this.translationLanguage$.next(availableTranslation?.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  trackByFunc(index: number, sentence: Sentence): string {
    return sentence.id;
  }

  trackByAvailableTranslationFunc(index: number, availableTranslation: Language): string {
    return availableTranslation.id;
  }

  submitNewSentence(newInput: NewSentenceInput): void {
    const { text } = newInput;

    if (this.lesson) {
      this.sentenceService
        .addSentence({ text, lessonId: this.lesson.id })
        .subscribe((addSentence: Sentence) => {
          if (addSentence) {
            alert(`${addSentence.text} is added.`);
          }
        }, (err: Error) => alert(err));
    }
  }

  submitNewTranslation(newInput: NewTranslationInput): void {
    if (newInput && this.lesson) {
      const lessonId = this.lesson.id;
      this.sentenceService
        .addTranslate(lessonId, newInput)
        .subscribe((addTranslation: Translation) => {
          if (addTranslation) {
            alert(`${addTranslation.text} is added.`);
          }
        }, (err: Error) => alert(err));
    }
  }
}
