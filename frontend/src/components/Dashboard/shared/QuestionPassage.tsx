import React, { useEffect, useRef } from "react";
import type { BaseSyntheticEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import classes from "./commonStyles.module.scss";

type Props = {
  selectedPassageId: string;
  questionPassage: string;
  onScrollFocus: () => void;
};

const QuestionPassage = ({ selectedPassageId, questionPassage, onScrollFocus }: Props) => {
  const questionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      onScrollFocus();
    };

    questionRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      questionRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollFocus]);

  if (!selectedPassageId || !questionPassage) {
    return null;
  }

  const restrictActions = (event: BaseSyntheticEvent) => {
    event?.preventDefault?.();
    return false;
  };

  return (
    <Textarea
      ref={questionRef}
      key={selectedPassageId}
      readOnly
      className={`resize-none h-[200px] border-2 font-medium text-md text-black ${classes.passageText} ${classes.userSelect} ${classes.textArea}`}
      disabled
      onClick={restrictActions}
      onChange={restrictActions}
      onPaste={restrictActions}
      onCopy={restrictActions}
      value={questionPassage}
    />
  );
};

export default QuestionPassage;