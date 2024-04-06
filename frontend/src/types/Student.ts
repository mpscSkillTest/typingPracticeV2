export type Subject = "ENGLISH" | "MARATHI";

export type TypingMode = "PRACTICE" | "TEST";

export type Result = {
  accuracy: number;
  backspacesCount: number;
  date: string;
  duration: number;
  errorsCount: number;
  keystrokesCount: number;
  mode: TypingMode;
  passageId: string;
  subject: Subject;
  totalWordsCount: number;
  typedWordsCount: number;
};
