import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LessonGQL, Lesson, Translation, Sentence, Language, TranslationGQL } from '../../generated/graphql';

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

  constructor(private route: ActivatedRoute,
              private lessonGQL: LessonGQL,
              private translationGQL: TranslationGQL,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const lessonId = params.get('lessonId');
        if (lessonId) {
          return this.lessonGQL.watch({
            lessonId,
          }, {
            pollInterval: environment.pollingInterval
          })
          .valueChanges;
        }
        return EMPTY;
      }),
      map(({ data }) => data.lesson),
      takeUntil(this.destroy$)
    ).subscribe(lesson => {
      this.lesson = lesson;
      this.cdr.markForCheck();
    });

    combineLatest([this.sentence$, this.translationLangauge$])
      .pipe(
        switchMap(([sentenceId, languageId]) =>
          this.translationGQL.watch({
            sentenceId,
            languageId
          }, {}).valueChanges
        ),
        map(({ data }) => data.getTranslation),
        startWith(undefined),
        takeUntil(this.destroy$)
      ).subscribe(translation => {
        this.selectedTranslation = translation;
        this.cdr.markForCheck();
      });
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
}
