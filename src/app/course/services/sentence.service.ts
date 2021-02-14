import { Injectable, OnDestroy } from '@angular/core';
import { gql } from 'apollo-angular';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AddSentenceGQL,
  AddSentenceInput,
  AddTranslationInput,
  AddTranslationGQL,
  TranslationGQL,
  LessonGQL,
  Sentence,
  Language,
  DeleteTranslationGQL,
  Lesson
} from '../../generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class SentenceService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(private translationGQL: TranslationGQL, private addSentenceGQL: AddSentenceGQL,
              private addTranslationGQL: AddTranslationGQL,
              private lessonGQL: LessonGQL,
              private deleteTranslationGQL: DeleteTranslationGQL) { }

  getTranslation(sentenceId: string, languageId: string): any {
    return this.translationGQL.watch({
      sentenceId,
      languageId
    }, {})
    .valueChanges
    .pipe(
      map(({ data }) => data.getTranslation),
      takeUntil(this.destroy$)
    );
  }

  addSentence(lesson: Lesson, newSentence: AddSentenceInput): any {
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
      map(({ data }) => data?.addSentence),
      takeUntil(this.destroy$)
    );
  }

  addTranslate(sentence: Sentence, newTranslation: AddTranslationInput): any {
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
      map(({ data }) => data?.addTranslation),
      takeUntil(this.destroy$)
    );
  }

  deleteTranslate(input: { lessonId: string, sentenceId: string, translationId: string }): any {
    const { lessonId, sentenceId, translationId } = input;

    return this.deleteTranslationGQL.mutate({
      id: translationId
    }, {
      update: (cache, { data }) => {
        const query = this.lessonGQL.document;
        const returnedTranslation = data?.deleteTranslation;
        const languageId = returnedTranslation?.language?.id;
        if (!sentenceId && !languageId) {
          return;
        }

        const options = {
          query,
          variables: {
            lessonId
          }
        };

        const { lesson: existingLesson }: any = cache.readQuery(options);
        const existingSentences: Sentence[] = existingLesson?.sentences || [];
        const existingSentence = existingSentences.find(item => item.id === sentenceId);
        if (!existingSentence) {
          return;
        }

        const existingTranslations = existingSentence.availableTranslations || [];
        const availableTranslations = existingTranslations.filter(t => t.id !== languageId);
        const sentences = existingSentences.map((item: Sentence) =>
          (item.id !== sentenceId) ? item : {
            ...item,
            availableTranslations
          }
        );

        const lesson = {
          ...existingLesson,
          sentences
        };

        cache.writeQuery({
          ...options,
          data: { lesson }
        });

        // const getTranslationOptions = {
        //   query: this.translationGQL.document,
        //   variables: {
        //     sentenceId,
        //     languageId
        //   }
        // }
        // const { getTranslation }: any = cache.readQuery(getTranslationOptions);
        // console.log('x', getTranslation);

        // cache.writeQuery({
        //   ...getTranslationOptions,
        //   data: { getTranslation: lesson }
        // });
      }
    })
    .pipe(
      map(({ data }) => data?.deleteTranslation),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    console.log('sentence service - ngOnDestroy fired');
  }
}
