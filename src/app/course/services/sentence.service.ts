import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AddSentenceGQL,
  AddSentenceInput,
  AddTranslationInput,
  AddTranslationGQL,
  TranslationGQL,
  LessonGQL
} from '../../generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class SentenceService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private translationGQL: TranslationGQL, private addSentenceGQL: AddSentenceGQL,
              private addTranslationGQL: AddTranslationGQL,
              private lessonGQL: LessonGQL) { }

  getTranslation(sentenceId: string, languageId: string): any {
    return this.translationGQL.watch({
      sentenceId,
      languageId
    }, {})
    .valueChanges
    .pipe(
      map(({ data }) => data.getTranslation),
      startWith(undefined),
      takeUntil(this.destroy$)
    );
  }

  addSentence(newSentence: AddSentenceInput): any {
    return this.addSentenceGQL.mutate({
      newSentence
    }, {
      update: (cache, { data }) => {
        const query = this.lessonGQL.document;
        const returnedSentence = data?.addSentence;

        const options = {
          query,
          variables: {
            lessonId: newSentence.lessonId
          }
        };

        const { lesson: existingLesson }: any = cache.readQuery(options);
        const { sentences: existingSentences } = existingLesson;
        const sentences = [ ...existingSentences, returnedSentence ];
        const lesson = {
          ...existingLesson,
          sentences
        };

        cache.writeQuery({
          ...options,
          data: { lesson }
        });
      }
    })
    .pipe(
      map(({ data }) => data?.addSentence),
      takeUntil(this.destroy$)
    );
  }

  addTranslate(newTranslation: AddTranslationInput): any {
    return this.addTranslationGQL.mutate({
      newTranslation
    })
    .pipe(
      map(({ data }) => data?.addTranslation),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
