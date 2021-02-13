import { Translation } from './../../generated/graphql';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { Language, Sentence } from '../../generated/graphql';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SentenceService } from '../services';

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

  destroy$ = new Subject<boolean>();
  sentence$ = new Subject<string>();
  translationLanguage$ = new Subject<string>();
  selectedTranslation: Translation | undefined = undefined;

  constructor(private sentenceService: SentenceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  trackByFunc(index: number, availableTranslation: Language): string {
    return availableTranslation.id;
  }

  showTranslation(sentence: Sentence, availableTranslation: Language): void {
    this.sentence$.next(sentence?.id);
    this.translationLanguage$.next(availableTranslation?.id);
  }
}
