import type { KeyboardEvent } from "react";
import { marathiTranslator } from "../../../../utils/marathiParser";
import { SKIP_CHECK_KEYDOWN, SPECIAL_CHECK_KEYDOWN } from "./constant";

type FunctionArgs = {
  event: KeyboardEvent;
  userInputRef: HTMLTextAreaElement | null;
  EnglishTextReal: string;
  currentKeystrokesCount: number;
  currentBackspacesCount: number;
  currentTypedWordsCount: number;
};

type FunctionResponse = {
  updatedKeystrokesCount: number;
  updatedBackspacesCount: number;
  translatedMarathiText: string;
  updatedTypedWordsCount: number;
  updatedEnglishTextInput: string;
  updatedCursorPosition: number;
};

export const findLastSpaceIndex = (inputString: string): number => {
  let currentIndex = inputString.length - 1;
  while (currentIndex >= 0) {
    if (inputString.charAt(currentIndex) === " ") {
      return currentIndex;
    }
    currentIndex -= 1;
  }
  return -1;
};

export function handleMarathiKeyDown({
  event,
  userInputRef: UserInput,
  currentKeystrokesCount,
  currentBackspacesCount,
  EnglishTextReal = "",
  currentTypedWordsCount,
}: FunctionArgs): FunctionResponse {
  let currentUserInputValue = UserInput?.value || "";
  let currentCursorPosition = UserInput?.selectionStart || 0;

  const updatedOutput = {
    updatedKeystrokesCount: currentKeystrokesCount,
    updatedBackspacesCount: currentBackspacesCount,
    translatedMarathiText: currentUserInputValue,
    updatedTypedWordsCount: currentTypedWordsCount,
    updatedEnglishTextInput: EnglishTextReal,
    updatedCursorPosition: currentCursorPosition,
  };

  const isSpaceKey = event.key === " ";
  const isEmptyValue = !currentUserInputValue.length;
  const isFirstSpace = isSpaceKey && isEmptyValue;
  const isLastLetterIsSpace =
    currentUserInputValue.charAt(currentUserInputValue.length - 1) === " ";

  const isDoubleSpace = isSpaceKey && !isEmptyValue && isLastLetterIsSpace;

  if (isFirstSpace || isDoubleSpace || !UserInput) {
    event.preventDefault();
    return updatedOutput;
  }

  const { key } = event;

  if (SKIP_CHECK_KEYDOWN[key]) {
    event.preventDefault();
    return updatedOutput;
  }

  let updatedKeyStr = key;

  let updatedKeystrokesCount = currentKeystrokesCount;
  let updatedBackspacesCount = currentBackspacesCount;
  let updatedTypedWordsCount = currentTypedWordsCount;
  let updatedEnglishTextInput = EnglishTextReal;

  // Need to add code for backspace and delete and enter
  if (SPECIAL_CHECK_KEYDOWN[key]) {
    updatedKeystrokesCount -= 1;
    updatedKeyStr = "";
    // Increment back space only if there is previous value present
    if (updatedEnglishTextInput.length) {
      updatedBackspacesCount += 1;
    }

    // Ensure keystroke count is never negative
    if (updatedKeystrokesCount < 0) {
      updatedKeystrokesCount = 0;
    }

    if (isLastLetterIsSpace && updatedTypedWordsCount > 0) {
      updatedTypedWordsCount -= 1;
    }

    updatedEnglishTextInput = updatedEnglishTextInput.slice(
      0,
      updatedEnglishTextInput.length - 1
    );
    currentUserInputValue = currentUserInputValue.slice(
      0,
      currentUserInputValue.length - 1
    );

    if (currentCursorPosition > 0) {
      currentCursorPosition -= 1;
    } else {
      currentCursorPosition = 0;
    }

    return {
      updatedBackspacesCount,
      updatedKeystrokesCount,
      translatedMarathiText: currentUserInputValue,
      updatedEnglishTextInput,
      updatedTypedWordsCount,
      updatedCursorPosition: currentCursorPosition,
    };
  }

  // if key entered which is does not include mapping return
  // we handle single single letter
  if (updatedKeyStr.length > 1) {
    event.preventDefault();
    return updatedOutput;
  } else if (!SPECIAL_CHECK_KEYDOWN[key]) {
    // update keystrokes
    updatedKeystrokesCount += 1;
  }

  if (isSpaceKey) {
    const updatedValue = currentUserInputValue + " ";
    currentCursorPosition = currentCursorPosition + 1;
    updatedEnglishTextInput = updatedEnglishTextInput + " ";
    updatedTypedWordsCount += 1;

    UserInput.scrollTop = UserInput.scrollHeight;
    event.preventDefault();

    return {
      updatedBackspacesCount,
      updatedEnglishTextInput,
      updatedTypedWordsCount,
      translatedMarathiText: updatedValue,
      updatedKeystrokesCount,
      updatedCursorPosition: currentCursorPosition,
    };
  }

  const findLastSpaceIndexInMarathi = findLastSpaceIndex(currentUserInputValue);
  const findLastSpaceIndexInEnglish = findLastSpaceIndex(
    updatedEnglishTextInput
  );

  let previousTranslatedValue = "";

  const wordToBeTranslated =
    updatedEnglishTextInput.substring(findLastSpaceIndexInEnglish + 1) +
    updatedKeyStr;

  updatedEnglishTextInput = updatedEnglishTextInput + updatedKeyStr;

  const translatedWord = marathiTranslator(wordToBeTranslated);

  let updatedValue = translatedWord;

  if (findLastSpaceIndexInMarathi > 0) {
    previousTranslatedValue = currentUserInputValue.substring(
      0,
      findLastSpaceIndexInMarathi + 1
    );
    updatedValue = previousTranslatedValue + translatedWord;
  } else {
    updatedValue = translatedWord;
  }

  event.preventDefault();
  return {
    translatedMarathiText: updatedValue,
    updatedEnglishTextInput,
    updatedBackspacesCount,
    updatedKeystrokesCount,
    updatedTypedWordsCount,
    updatedCursorPosition: updatedValue.length,
  };
}
