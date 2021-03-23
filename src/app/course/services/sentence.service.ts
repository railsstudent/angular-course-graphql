import { Injectable, OnDestroy } from '@angular/core';
import { gql } from 'apollo-angular';
import { Subject, Observable, EMPTY } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { AddSentenceGQL,
  AddSentenceInput,
  AddTranslationInput,
  AddTranslationGQL,
  TranslationGQL,
  Sentence,
  DeleteTranslationGQL,
  Lesson,
  DeleteSentenceGQL,
  Translation
} from '../../generated/graphql';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class SentenceService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private translationGQL: TranslationGQL, private addSentenceGQL: AddSentenceGQL,
              private addTranslationGQL: AddTranslationGQL,
              private deleteTranslationGQL: DeleteTranslationGQL,
              private deleteSetenceGQL: DeleteSentenceGQL,
              private alertService: AlertService) { }

  getTranslation(sentenceId: string, languageId: string): Observable<Translation> {
    return this.translationGQL.watch({
      sentenceId,
      languageId
    }, {})
    .valueChanges
    .pipe(
      map(({ data }) => data.getTranslation as Translation),
      catchError((err: Error) => {
        this.alertService.setError(err.message);
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    );
  }

  addSentence(lesson: Lesson, newSentence: AddSentenceInput): Observable<Sentence> {
    this.alertService.clearMsgs();
    return this.addSentenceGQL.mutate({
      newSentence
    }, {
      update: (cache, { data }) => {
        const returnedSentence = data?.addSentence;
        cache.modify({
          id: cache.identify(lesson),
          fields: {
            sentences(existingSentenceRefs = [], { readField }): any[] {
              const newSentenceRef = cache.writeFragment({
                data: returnedSentence,
                fragment: gql`
                  fragment NewSentence on Sentence {
                    id
                    text
                  }
                `
              });
              // Quick safety check - if the new sentence is already
              // present in the cache, we don't need to add it again.
              if (returnedSentence && existingSentenceRefs.some(
                (ref: any) => readField('id', ref) === returnedSentence.id
              )) {
                return existingSentenceRefs;
              }
              return [...existingSentenceRefs, newSentenceRef];
            }
          }
        });
      }
    })
    .pipe(
      map(({ data }) => data?.addSentence as Sentence),
      tap((addSentence: Sentence) => this.alertService.setSuccess(`${addSentence.text} is added.`)),
      catchError((err: Error) => {
        this.alertService.setError(err.message);
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    );
  }

  deleteSentence(lesson: Lesson, sentenceId: string): Observable<Sentence> {
    return this.deleteSetenceGQL.mutate({
      id: sentenceId
    }, {
      update: (cache, { data }) => {
        const returnedSentence = data?.deleteSentence;
        const sentence = returnedSentence?.sentence;
        const translations = returnedSentence?.translations || [];
        cache.modify({
          id: cache.identify(lesson),
          fields: {
            sentences(existingSentenceRefs = [], { readField }): any[] {
              return existingSentenceRefs.filter((ref: any) => sentence?.id !== readField('id', ref));
            }
          }
        });

        if (translations && translations.length > 0) {
          for (const translation of translations) {
            cache.evict({ id: translation.id });
          }
          cache.gc();
        }
      }
    })
    .pipe(
      map(({ data }) => data?.deleteSentence?.sentence as Sentence),
      takeUntil(this.destroy$)
    );
  }

  addTranslate(sentence: Sentence, newTranslation: AddTranslationInput): Observable<Translation> {
    return this.addTranslationGQL.mutate({
      newTranslation
    }, {
      update: (cache, { data }) => {
        const returnedTranslation = data?.addTranslation;
        cache.modify({
          id: cache.identify(sentence),
          fields: {
            availableTranslations(existingLanguageRefs = [], { readField }): any[] {
              const newLanguageRef = cache.writeFragment({
                data: returnedTranslation,
                fragment: gql`
                  fragment NewLanguage on Language {
                    id
                    name
                  }
                `
              });
              // Quick safety check - if the new language is already
              // present in the cache, we don't need to add it again.
              if (returnedTranslation && existingLanguageRefs.some(
                (ref: any) => readField('id', ref) === returnedTranslation.id
              )) {
                return existingLanguageRefs;
              }
              return [...existingLanguageRefs, newLanguageRef]
                .sort((a, b) => {
                  const aName = a.name || '';
                  const bName = b.name || '';
                  return aName.localeCompare(bName);
                });
            }
          }
        });
      }
    })
    .pipe(
      map(({ data }) => data?.addTranslation as Translation),
      takeUntil(this.destroy$)
    );
  }

  deleteTranslate(sentence: Sentence, translationId: string): Observable<Translation> {
    return this.deleteTranslationGQL.mutate({
      id: translationId
    }, {
      update: (cache, { data }) => {
        const returnedTranslation = data?.deleteTranslation;
        const language = data?.deleteTranslation?.language;

        cache.modify({
          id: cache.identify(sentence),
          fields: {
            availableTranslations(existingLanguageRefs = [], { readField }): any[] {
              return existingLanguageRefs.filter((ref: any) => language?.id !== readField('id', ref));
            }
          }
        });

        if (returnedTranslation) {
          const evictedId = cache.identify(returnedTranslation);
          cache.evict({ id: evictedId });
          cache.gc();
        }
      }
    })
    .pipe(
      map(({ data }) => data?.deleteTranslation as Translation),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    console.log('sentence service - ngOnDestroy fired');
  }
}
