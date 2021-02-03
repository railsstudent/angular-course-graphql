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

/** Language model */
export type Language = {
  __typename?: 'Language';
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

export type AllCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCoursesQuery = (
  { __typename?: 'Query' }
  & { courses?: Maybe<Array<(
    { __typename?: 'Course' }
    & Pick<Course, 'id' | 'name' | 'description'>
    & { language?: Maybe<(
      { __typename?: 'Language' }
      & Pick<Language, 'id' | 'name' | 'nativeName'>
    )> }
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
    & Pick<Course, 'id' | 'name'>
    & { lessons?: Maybe<Array<(
      { __typename?: 'Lesson' }
      & Pick<Lesson, 'id' | 'name'>
    )>> }
  )> }
);

export type LessonQueryVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type LessonQuery = (
  { __typename?: 'Query' }
  & { lesson?: Maybe<(
    { __typename?: 'Lesson' }
    & Pick<Lesson, 'id' | 'name'>
    & { course?: Maybe<(
      { __typename?: 'Course' }
      & Pick<Course, 'id' | 'name'>
    )>, sentences?: Maybe<Array<(
      { __typename?: 'Sentence' }
      & Pick<Sentence, 'id' | 'text'>
      & { availableTranslations?: Maybe<Array<(
        { __typename?: 'Language' }
        & Pick<Language, 'id' | 'name'>
      )>> }
    )>> }
  )> }
);

export type TranslationQueryVariables = Exact<{
  sentenceId: Scalars['String'];
  languageId: Scalars['String'];
}>;


export type TranslationQuery = (
  { __typename?: 'Query' }
  & { getTranslation: (
    { __typename?: 'Translation' }
    & Pick<Translation, 'id' | 'text'>
  ) }
);

export const AllCoursesDocument = gql`
    query AllCourses {
  courses {
    id
    name
    description
    language {
      id
      name
      nativeName
    }
  }
}
    `;

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
    id
    name
    lessons(args: $args) {
      id
      name
    }
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class CourseGQL extends Apollo.Query<CourseQuery, CourseQueryVariables> {
  document = CourseDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LessonDocument = gql`
  query Lesson($lessonId: String!) {
lesson(id: $lessonId) {
  id
  name
  course {
    id
    name
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
  `;

@Injectable({
  providedIn: 'root'
})
export class LessonGQL extends Apollo.Query<LessonQuery, LessonQueryVariables> {
  document = LessonDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const TranslationDocument = gql`
  query Translation($sentenceId: String!, $languageId: String!) {
getTranslation(sentenceId: $sentenceId, languageId: $languageId) {
  id
  text
}
}
  `;

@Injectable({
  providedIn: 'root'
})
export class TranslationGQL extends Apollo.Query<TranslationQuery, TranslationQueryVariables> {
  document = TranslationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
