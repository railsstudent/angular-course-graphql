import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, of } from 'rxjs';
import { distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Language, Sentence, Translation } from '../../generated/graphql';
import { SentenceService } from '../services';
import { tag } from 'rxjs-spy/operators/tag';
import { create } from 'rxjs-spy';
const spy = create();
spy.log(/get-translation-.+/);
spy.log('selected-translation');
spy.log(/null-translation-.+/);

@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SentenceComponent implements OnInit, OnDestroy {
  @Input()
  sentence: Sentence | undefined | null = null;

  @Input()
  index = 0;

  @Input()
  lessonId: string | undefined | null = '';

  destroy$ = new Subject<boolean>();
  translate$ = new Subject<string | null>();
  selectedTranslation: Translation | null = null;

  constructor(private sentenceService: SentenceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.translate$
      .pipe(
        distinctUntilChanged(),
        switchMap((languageId) => {
          const sentenceId = this.sentence?.id || '';
          if (!sentenceId || !languageId) {
            return of(null);
          }
          return this.sentenceService.getTranslation(sentenceId, languageId)
              .pipe(tag(`get-translation-${sentenceId}-${languageId}`));
        }),
        takeUntil(this.destroy$),
        tag('selected-translation')
      ).subscribe((translation: any) => {
        this.selectedTranslation = translation as Translation;
        this.cdr.markForCheck();
      }, (err) => alert(err));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  trackByFunc(index: number, availableTranslation: Language): string {
    return availableTranslation.id;
  }

  showTranslation(availableTranslation: Language): void {
    this.translate$.next(availableTranslation?.id);
  }

  deleteTranslation(translationId: string): void {
    const answer = confirm('Do you want to delete the translation?');
    if (answer) {
      if (!this.sentence) {
        alert('Sentence is missing');
        return;
      }

      this.sentenceService.deleteTranslate(this.sentence, translationId)
        .subscribe((translation: any) => {
          this.translate$.next(null);
          alert(`${translation.text} is deleted`);
        }, (err: Error) => alert(err));
    }
  }
}
