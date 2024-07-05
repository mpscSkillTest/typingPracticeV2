import type { BaseSyntheticEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import classes from "./commonStyles.module.scss";

type Props = {
  selectedPassageId: string;
  questionPassage: string;
  onScrollFocus: () => void;
};

const QuestionPassage = ({
  selectedPassageId,
  questionPassage,
  onScrollFocus,
}: Props) => {
  if (!selectedPassageId || !questionPassage) {
    return null;
  }

  const restrictActions = (event: BaseSyntheticEvent) => {
    event?.preventDefault?.();
    return false;
  };

  return (
    <Textarea
      key={selectedPassageId}
      readOnly
      className={`resize-none h-[200px] border-2 text-md ${classes.passageText} ${classes.userSelect} ${classes.textArea}`}
      disabled
      onClick={restrictActions}
      onChange={restrictActions}
      onPaste={restrictActions}
      onCopy={restrictActions}
      value={questionPassage}
      onScroll={onScrollFocus}
    />
  );
};

export default QuestionPassage;
