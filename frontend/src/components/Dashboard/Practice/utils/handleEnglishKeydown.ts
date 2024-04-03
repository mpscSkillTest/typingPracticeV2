import type { KeyboardEvent } from "react";
import { SKIP_CHECK_KEYDOWN, SPECIAL_CHECK_KEYDOWN } from "./constant";

type FunctionArgs = {
  event: KeyboardEvent<Element>;
  inputText: string;
  currentKeystrokesCount: number;
  currentBackspacesCount: number;
};

type FunctionResponse = {
  updatedKeystrokesCount: number;
  updatedBackspacesCount: number;
};

const SPACE_VALUE = " ";

export function handleEnglishKeyDown({
  event,
  inputText,
  currentKeystrokesCount,
  currentBackspacesCount,
}: FunctionArgs): FunctionResponse {
  const { key } = event || {};

  const updatedCounts = {
    updatedKeystrokesCount: currentKeystrokesCount,
    updatedBackspacesCount: currentBackspacesCount,
  };

  const isDoubleSpaceKey =
    key === SPACE_VALUE &&
    inputText.slice(inputText.length - 1) === SPACE_VALUE;

  const isSpecialKeyPressed = SKIP_CHECK_KEYDOWN[key];

  if (isDoubleSpaceKey || isSpecialKeyPressed) {
    event.preventDefault();
    return updatedCounts;
  }

  let updatedKeystrokesCount = currentKeystrokesCount;
  let updatedBackspacesCount = currentBackspacesCount;

  // Decrement keystroke count for backspace key
  if (SPECIAL_CHECK_KEYDOWN[key]) {
    updatedKeystrokesCount -= 1;
    // Increment back space only if there is previous value present
    if (typeof inputText === "string" && inputText !== "") {
      updatedBackspacesCount += 1;
    }

    // Ensure keystroke count is never negative
    if (updatedKeystrokesCount < 0) {
      updatedKeystrokesCount = 0;
    }

    return {
      updatedKeystrokesCount,
      updatedBackspacesCount,
    };
  }

  return {
    updatedKeystrokesCount: updatedKeystrokesCount + 1,
    updatedBackspacesCount,
  };
}
