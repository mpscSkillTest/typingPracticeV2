import {
  useRef,
  type BaseSyntheticEvent,
  KeyboardEvent,
  ChangeEventHandler,
  RefObject,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { handleEnglishKeyDown } from "../../../utils/passageUtils/handleEnglishKeydown";
import { handleMarathiKeyDown } from "../../../utils/passageUtils/handleMarathiKeydown";
import type { Subject } from "../../../types";
import classes from "./commonStyles.module.scss";

export type OnKeyDownArgs = {
  updatedBackspacesCount?: number;
  updatedKeystrokesCount?: number;
  updatedTypedWordsCount?: number;
  updatedUserInputText?: string;
};

export type OnChangeArgs = {
  updatedTypedWordsCount?: number;
  updatedUserInputText?: string;
};

type Props = {
  onKeyDown: (args: OnKeyDownArgs) => void;
  onChange: (args: OnChangeArgs) => void;
  shouldDisable: boolean;
  subject?: Subject;
  totalTypedWords: number;
  keystrokesCount: number;
  backspacesCount: number;
  userInputText: string;
  userInputRef: RefObject<HTMLTextAreaElement>;
};

const AnswerPassage = ({
  onKeyDown,
  onChange,
  shouldDisable,
  subject,
  totalTypedWords = 0,
  keystrokesCount = 0,
  backspacesCount = 0,
  userInputText = "",
  userInputRef,
}: Props) => {
  const englishInputText = useRef<string>("");

  const restrictActions = (event: BaseSyntheticEvent) => {
    event?.preventDefault?.();
    return false;
  };

  const onUserInputKeyDown = (event: KeyboardEvent) => {
    if (subject === "ENGLISH") {
      const { updatedBackspacesCount, updatedKeystrokesCount } =
        handleEnglishKeyDown({
          event,
          inputText: userInputText,
          currentBackspacesCount: backspacesCount,
          currentKeystrokesCount: keystrokesCount,
        });

      if (typeof onKeyDown === "function") {
        onKeyDown({
          updatedBackspacesCount,
          updatedKeystrokesCount,
        });
      }
    }

    if (subject === "MARATHI") {
      const marathiTranslationDetails = handleMarathiKeyDown({
        event,
        userInputRef: userInputRef.current,
        EnglishTextReal: englishInputText.current,
        currentBackspacesCount: backspacesCount,
        currentKeystrokesCount: keystrokesCount,
        currentTypedWordsCount: totalTypedWords,
      });
      const {
        updatedBackspacesCount,
        translatedMarathiText,
        updatedEnglishTextInput,
        updatedCursorPosition,
        updatedTypedWordsCount,
        updatedKeystrokesCount,
      } = marathiTranslationDetails || {};

      englishInputText.current = updatedEnglishTextInput;

      if (userInputRef.current) {
        userInputRef.current.selectionStart = updatedCursorPosition;
        userInputRef.current.scrollTop = updatedCursorPosition;
      }

      if (typeof onKeyDown === "function") {
        onKeyDown({
          updatedBackspacesCount,
          updatedKeystrokesCount,
          updatedTypedWordsCount,
          updatedUserInputText: translatedMarathiText,
        });
      }
    }
  };

  const onUserInputChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (subject === "MARATHI") {
      event.preventDefault?.();
      return;
    }
    if (subject === "ENGLISH") {
      const updatedInputText = event.target.value || "";
      const totalTypedWordsClone =
        updatedInputText.trim().split(" ").length || 0;
      if (typeof onChange === "function") {
        onChange({
          updatedTypedWordsCount: totalTypedWordsClone,
          updatedUserInputText: updatedInputText,
        });
      }
    }
  };

  return (
    <Textarea
      spellCheck={false}
      ref={userInputRef}
      value={userInputText}
      autoFocus
      onKeyDown={onUserInputKeyDown}
      onChange={onUserInputChange}
      onCut={restrictActions}
      onPaste={restrictActions}
      onCopy={restrictActions}
      onWheel={restrictActions}
      disabled={shouldDisable}
      className={`h-[200px] resize-none font-normal text-md text-black ${classes.userSelect} ${classes.textArea}`}
      placeholder="Type your passage here."
    />
  );
};

export default AnswerPassage;
