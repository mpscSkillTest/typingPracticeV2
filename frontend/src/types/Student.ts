import { Duration } from "../enums/Duration";
import type { Passage } from "./User";

export type Subject = "ENGLISH" | "MARATHI";

export type TypingMode = "PRACTICE" | "TEST" | "MOCK";

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
	resultId?: number;
	passageTitle?: string;
	mpscAccuracy: number;
	mpscErrorsCount: number;
};

export type MockTestDetails = {
	keyboardTestPassageDetails?: Passage;
	practicePassageDetails?: Passage;
	testPassageDetails?: Passage;
};

export type Values<T> = { [K in keyof T]: T[K] }[keyof T];

export type DurationOption = keyof typeof Duration;

export type DurationValue = Values<typeof Duration>;

export type Lesson = {
	title: string;
	id: number;
	text: string;
};

export type LessonResult = {
	id: number;
	accuracy: number;
	isCompleted: boolean;
};
