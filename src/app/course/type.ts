export type NewCourseInput = {
  name: string;
  description: string;
  languageId: string;
};

export type NewLessonInput = {
  name: string;
};

export type NewSentenceInput = {
  text: string;
};

export type NewTranslationInput = {
  text: string;
  sentenceId: string;
  languageId: string;
};
