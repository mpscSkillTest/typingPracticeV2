import type { BaseSyntheticEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import classes from "./commonStyles.module.scss";

type Props = {
  selectedPassageId: string;
  questionPassage: string;
};

const QuestionPassage = ({ selectedPassageId, questionPassage }: Props) => {
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
      className={`resize-none h-[200px] border-2 font-medium text-md text-black ${classes.passageText} ${classes.userSelect}`}
      disabled
      onChange={restrictActions}
      onPaste={restrictActions}
      onCopy={restrictActions}
      value={questionPassage}
    />
  );
};

export default QuestionPassage;
