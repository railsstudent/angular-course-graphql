import { Injectable, OnDestroy } from '@angular/core';
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
  DeleteTranslationGQL
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

  addTranslate(lessonId: string, newTranslation: AddTranslationInput): any {
    return this.addTranslationGQL.mutate({
      newTranslation
    }, {
      update: (cache, { data }) => {
        const query = this.lessonGQL.document;
        const returnedLanguage: Language | undefined | null = data?.addTranslation?.language;
        if (!returnedLanguage) {
          return;
        }

        const options = {
          query,
          variables: {
            lessonId
          }
        };

        const { sentenceId } = newTranslation;
        const { lesson: existingLesson }: any = cache.readQuery(options);
        const existingSentences: Sentence[] = existingLesson?.sentences || [];
        const existingSentence = existingSentences.find(item => item.id === sentenceId);
        if (!existingSentence) {
          return;
        }

        const existingTranslations = existingSentence.availableTranslations || [];
        const availableTranslations = [...existingTranslations, returnedLanguage]
          .sort((a, b) => {
            const aName = a.name || '';
            const bName = b.name || '';
            return aName.localeCompare(bName);
          });
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
      }
    })
    .pipe(
      map(({ data }) => data?.addTranslation),
      takeUntil(this.destroy$)
    );
  }

  deleteTranslate(lessonId: string, translationId: string): any {
    return this.deleteTranslationGQL.mutate({
      id: translationId
    }, {
      update: (cache, { data }) => {
        const query = this.lessonGQL.document;
        const returnedTranslation = data?.deleteTranslation;
        const languageId = returnedTranslation?.language?.id;
        const sentenceId = returnedTranslation?.sentence?.id;
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
