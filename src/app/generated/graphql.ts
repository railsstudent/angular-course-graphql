import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};



export type AddCourseInput = {
  description: Scalars['String'];
  languageId: Scalars['String'];
  name: Scalars['String'];
};

export type AddLanguageInput = {
  name: Scalars['String'];
  nativeName: Scalars['String'];
};

export type AddLessonInput = {
  courseId: Scalars['String'];
  name: Scalars['String'];
};

export type AddSentenceInput = {
  lessonId: Scalars['String'];
  text: Scalars['String'];
};

export type AddTranslationInput = {
  languageId: Scalars['String'];
  sentenceId: Scalars['String'];
  text: Scalars['String'];
};

/** Course model */
export type Course = {
  __typename?: 'Course';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  language?: Maybe<Language>;
  lessons?: Maybe<Array<Lesson>>;
  name?: Maybe<Scalars['String']>;
};


/** Course model */
export type CourseLessonsArgs = {
  args: PaginationArgs;
};

/** Deleted sentence model */
export type DeletedSentence = {
  __typename?: 'DeletedSentence';
  sentence?: Maybe<Sentence>;
  translations?: Maybe<Array<Translation>>;
};

/** Language model */
export type Language = {
  __typename?: 'Language';
  fullname?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  nativeName?: Maybe<Scalars['String']>;
};

/** Lesson model */
export type Lesson = {
  __typename?: 'Lesson';
  course?: Maybe<Course>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  sentences?: Maybe<Array<Sentence>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCourse: Course;
  addLanguage: Language;
  addLesson: Lesson;
  addSentence: Sentence;
  addTranslation: Translation;
  deleteSentence: DeletedSentence;
  deleteTranslation: Translation;
  updateCourse: Course;
  updateLanguage: Language;
  updateLesson: Lesson;
  updateSentence: Sentence;
};


export type MutationAddCourseArgs = {
  newCourse: AddCourseInput;
};


export type MutationAddLanguageArgs = {
  newLanguage: AddLanguageInput;
};


export type MutationAddLessonArgs = {
  newLesson: AddLessonInput;
};


export type MutationAddSentenceArgs = {
  newSentence: AddSentenceInput;
};


export type MutationAddTranslationArgs = {
  newTranslation: AddTranslationInput;
};


export type MutationDeleteSentenceArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTranslationArgs = {
  id: Scalars['String'];
};


export type MutationUpdateCourseArgs = {
  course: UpdateCourseInput;
};


export type MutationUpdateLanguageArgs = {
  updateLanguage: UpdateLanguageInput;
};


export type MutationUpdateLessonArgs = {
  lesson: UpdateLessonInput;
};


export type MutationUpdateSentenceArgs = {
  updateSentence: UpdateSentenceInput;
};

export type PaginationArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  course?: Maybe<Course>;
  courses?: Maybe<Array<Course>>;
  getLanguages: Array<Language>;
  getSentence: Sentence;
  getTranslation: Translation;
  lesson?: Maybe<Lesson>;
};


export type QueryCourseArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryCoursesArgs = {
  args: PaginationArgs;
};


export type QueryGetSentenceArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryGetTranslationArgs = {
  languageId: Scalars['String'];
  sentenceId: Scalars['String'];
};


export type QueryLessonArgs = {
  id?: Maybe<Scalars['String']>;
};

/** Sentence model */
export type Sentence = {
  __typename?: 'Sentence';
  availableTranslations?: Maybe<Array<Language>>;
  id: Scalars['ID'];
  lesson?: Maybe<Lesson>;
  text?: Maybe<Scalars['String']>;
  translations?: Maybe<Array<Translation>>;
};

/** Translation model */
export type Translation = {
  __typename?: 'Translation';
  id: Scalars['ID'];
  language?: Maybe<Language>;
  sentence?: Maybe<Sentence>;
  text?: Maybe<Scalars['String']>;
};

export type UpdateCourseInput = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  languageId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type UpdateLanguageInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  nativeName?: Maybe<Scalars['String']>;
};

export type UpdateLessonInput = {
  courseId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type UpdateSentenceInput = {
  id: Scalars['ID'];
  lessonId?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type CourseLanguageFragment = (
  { __typename?: 'Language' }
  & Pick<Language, 'id' | 'name' | 'fullname'>
);

export type CourseNameFragment = (
  { __typename?: 'Course' }
  & Pick<Course, 'id' | 'name' | 'description'>
);

export type AllCoursesQueryVariables = Exact<{
  args: PaginationArgs;
}>;


export type AllCoursesQuery = (
  { __typename?: 'Query' }
  & { courses?: Maybe<Array<(
    { __typename?: 'Course' }
    & { language?: Maybe<(
      { __typename?: 'Language' }
      & CourseLanguageFragment
    )> }
    & CourseNameFragment
  )>> }
);

export type CourseQueryVariables = Exact<{
  courseId: Scalars['String'];
  args: PaginationArgs;
}>;


export type CourseQuery = (
  { __typename?: 'Query' }
  & { course?: Maybe<(
    { __typename?: 'Course' }
    & { language?: Maybe<(
      { __typename?: 'Language' }
      & CourseLanguageFragment
    )>, lessons?: Maybe<Array<(
      { __typename?: 'Lesson' }
      & Pick<Lesson, 'id' | 'name'>
    )>> }
    & CourseNameFragment
  )> }
);

export type LanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type LanguagesQuery = (
  { __typename?: 'Query' }
  & { getLanguages: Array<(
    { __typename?: 'Language' }
    & CourseLanguageFragment
  )> }
);

export type AddCourseMutationVariables = Exact<{
  newCourse: AddCourseInput;
}>;


export type AddCourseMutation = (
  { __typename?: 'Mutation' }
  & { addCourse: (
    { __typename?: 'Course' }
    & { language?: Maybe<(
      { __typename?: 'Language' }
      & CourseLanguageFragment
    )> }
    & CourseNameFragment
  ) }
);

export type LessonNameFragment = (
  { __typename?: 'Lesson' }
  & Pick<Lesson, 'id' | 'name'>
);

export type TranslationTextFragment = (
  { __typename?: 'Translation' }
  & Pick<Translation, 'id' | 'text'>
);

export type SentenceTextFragment = (
  { __typename?: 'Sentence' }
  & Pick<Sentence, 'id' | 'text'>
);

export type LessonQueryVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type LessonQuery = (
  { __typename?: 'Query' }
  & { lesson?: Maybe<(
    { __typename?: 'Lesson' }
    & { course?: Maybe<(
      { __typename?: 'Course' }
      & { language?: Maybe<(
        { __typename?: 'Language' }
        & CourseLanguageFragment
      )> }
      & CourseNameFragment
    )>, sentences?: Maybe<Array<(
      { __typename?: 'Sentence' }
      & Pick<Sentence, 'id' | 'text'>
      & { availableTranslations?: Maybe<Array<(
        { __typename?: 'Language' }
        & Pick<Language, 'id' | 'name'>
      )>> }
    )>> }
    & LessonNameFragment
  )> }
);

export type AddLessonMutationVariables = Exact<{
  newLesson: AddLessonInput;
}>;


export type AddLessonMutation = (
  { __typename?: 'Mutation' }
  & { addLesson: (
    { __typename?: 'Lesson' }
    & LessonNameFragment
  ) }
);

export type AddSentenceMutationVariables = Exact<{
  newSentence: AddSentenceInput;
}>;


export type AddSentenceMutation = (
  { __typename?: 'Mutation' }
  & { addSentence: (
    { __typename?: 'Sentence' }
    & SentenceTextFragment
  ) }
);

export type DeleteSentenceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteSentenceMutation = (
  { __typename?: 'Mutation' }
  & { deleteSentence: (
    { __typename?: 'DeletedSentence' }
    & { sentence?: Maybe<(
      { __typename?: 'Sentence' }
      & SentenceTextFragment
    )>, translations?: Maybe<Array<(
      { __typename?: 'Translation' }
      & TranslationTextFragment
    )>> }
  ) }
);

export type AddTranslationMutationVariables = Exact<{
  newTranslation: AddTranslationInput;
}>;


export type AddTranslationMutation = (
  { __typename?: 'Mutation' }
  & { addTranslation: (
    { __typename?: 'Translation' }
    & { language?: Maybe<(
      { __typename?: 'Language' }
      & CourseLanguageFragment
    )> }
    & TranslationTextFragment
  ) }
);

export type TranslationQueryVariables = Exact<{
  sentenceId: Scalars['String'];
  languageId: Scalars['String'];
}>;


export type TranslationQuery = (
  { __typename?: 'Query' }
  & { getTranslation: (
    { __typename?: 'Translation' }
    & { language?: Maybe<(
      { __typename?: 'Language' }
      & CourseLanguageFragment
    )> }
    & TranslationTextFragment
  ) }
);

export type DeleteTranslationMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTranslationMutation = (
  { __typename?: 'Mutation' }
  & { deleteTranslation: (
    { __typename?: 'Translation' }
    & { language?: Maybe<(
      { __typename?: 'Language' }
      & CourseLanguageFragment
    )> }
    & TranslationTextFragment
  ) }
);

export const CourseLanguageFragmentDoc = gql`
    fragment CourseLanguage on Language {
  id
  name
  fullname
}
    `;
export const CourseNameFragmentDoc = gql`
    fragment CourseName on Course {
  id
  name
  description
}
    `;
export const LessonNameFragmentDoc = gql`
    fragment LessonName on Lesson {
  id
  name
}
    `;
export const TranslationTextFragmentDoc = gql`
    fragment TranslationText on Translation {
  id
  text
}
    `;
export const SentenceTextFragmentDoc = gql`
    fragment SentenceText on Sentence {
  id
  text
}
    `;
export const AllCoursesDocument = gql`
    query AllCourses($args: PaginationArgs!) {
  courses(args: $args) {
    ...CourseName
    language {
      ...CourseLanguage
    }
  }
}
    ${CourseNameFragmentDoc}
${CourseLanguageFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class AllCoursesGQL extends Apollo.Query<AllCoursesQuery, AllCoursesQueryVariables> {
    document = AllCoursesDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CourseDocument = gql`
    query Course($courseId: String!, $args: PaginationArgs!) {
  course(id: $courseId) {
    ...CourseName
    language {
      ...CourseLanguage
    }
    lessons(args: $args) {
      id
      name
    }
  }
}
    ${CourseNameFragmentDoc}
${CourseLanguageFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class CourseGQL extends Apollo.Query<CourseQuery, CourseQueryVariables> {
    document = CourseDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LanguagesDocument = gql`
    query Languages {
  getLanguages {
    ...CourseLanguage
  }
}
    ${CourseLanguageFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class LanguagesGQL extends Apollo.Query<LanguagesQuery, LanguagesQueryVariables> {
    document = LanguagesDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddCourseDocument = gql`
    mutation addCourse($newCourse: AddCourseInput!) {
  addCourse(newCourse: $newCourse) {
    ...CourseName
    language {
      ...CourseLanguage
    }
  }
}
    ${CourseNameFragmentDoc}
${CourseLanguageFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class AddCourseGQL extends Apollo.Mutation<AddCourseMutation, AddCourseMutationVariables> {
    document = AddCourseDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LessonDocument = gql`
    query Lesson($lessonId: String!) {
  lesson(id: $lessonId) {
    ...LessonName
    course {
      ...CourseName
      language {
        ...CourseLanguage
      }
    }
    sentences {
      id
      text
      availableTranslations {
        id
        name
      }
    }
  }
}
    ${LessonNameFragmentDoc}
${CourseNameFragmentDoc}
${CourseLanguageFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class LessonGQL extends Apollo.Query<LessonQuery, LessonQueryVariables> {
    document = LessonDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddLessonDocument = gql`
    mutation addLesson($newLesson: AddLessonInput!) {
  addLesson(newLesson: $newLesson) {
    ...LessonName
  }
}
    ${LessonNameFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class AddLessonGQL extends Apollo.Mutation<AddLessonMutation, AddLessonMutationVariables> {
    document = AddLessonDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddSentenceDocument = gql`
    mutation addSentence($newSentence: AddSentenceInput!) {
  addSentence(newSentence: $newSentence) {
    ...SentenceText
  }
}
    ${SentenceTextFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class AddSentenceGQL extends Apollo.Mutation<AddSentenceMutation, AddSentenceMutationVariables> {
    document = AddSentenceDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteSentenceDocument = gql`
    mutation deleteSentence($id: String!) {
  deleteSentence(id: $id) {
    sentence {
      ...SentenceText
    }
    translations {
      ...TranslationText
    }
  }
}
    ${SentenceTextFragmentDoc}
${TranslationTextFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class DeleteSentenceGQL extends Apollo.Mutation<DeleteSentenceMutation, DeleteSentenceMutationVariables> {
    document = DeleteSentenceDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddTranslationDocument = gql`
    mutation addTranslation($newTranslation: AddTranslationInput!) {
  addTranslation(newTranslation: $newTranslation) {
    ...TranslationText
    language {
      ...CourseLanguage
    }
  }
}
    ${TranslationTextFragmentDoc}
${CourseLanguageFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class AddTranslationGQL extends Apollo.Mutation<AddTranslationMutation, AddTranslationMutationVariables> {
    document = AddTranslationDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const TranslationDocument = gql`
    query Translation($sentenceId: String!, $languageId: String!) {
  getTranslation(sentenceId: $sentenceId, languageId: $languageId) {
    ...TranslationText
    language {
      ...CourseLanguage
    }
  }
}
    ${TranslationTextFragmentDoc}
${CourseLanguageFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class TranslationGQL extends Apollo.Query<TranslationQuery, TranslationQueryVariables> {
    document = TranslationDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteTranslationDocument = gql`
    mutation deleteTranslation($id: String!) {
  deleteTranslation(id: $id) {
    ...TranslationText
    language {
      ...CourseLanguage
    }
  }
}
    ${TranslationTextFragmentDoc}
${CourseLanguageFragmentDoc}`;

@Injectable({
    providedIn: 'root'
  })
  export class DeleteTranslationGQL extends Apollo.Mutation<DeleteTranslationMutation, DeleteTranslationMutationVariables> {
    document = DeleteTranslationDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
