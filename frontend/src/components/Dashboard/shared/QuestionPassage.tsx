import type { BaseSyntheticEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/ui/icons";
import type { Subject } from "../../../types";
import classes from "./commonStyles.module.scss";

type Props = {
  selectedPassageId: string;
  questionPassage: string;
  subject?: Subject;
  shouldShowInfo?: boolean;
};

const QuestionPassage = ({
  selectedPassageId,
  questionPassage,
  subject,
  shouldShowInfo,
}: Props) => {
  if (!selectedPassageId || !questionPassage) {
    return null;
  }
  const restrictActions = (event: BaseSyntheticEvent) => {
    event?.preventDefault?.();
    return false;
  };

  let minimumKeystrokes = 1500;
  if (subject === "ENGLISH") {
    minimumKeystrokes = 2000;
  }

  return (
    <>
      {shouldShowInfo ? (
        <div className="flex flex-col gap-2 my-2 text-xs font-medium">
          <div className="flex gap-1 items-center">
            <Icons.BadgeInfo height={14} width={14} />
            Exam Passing criteria
          </div>
          <div className="flex flex-col gap-2">
            <span>
              <b>Open Category</b>: Minimum {minimumKeystrokes} Keystrokes and
              Accuracy greater than or equal to 93%
            </span>
            <span>
              <b>Reserved Category</b>: Minimum {minimumKeystrokes} Keystrokes
              and Accuracy greater than or equal to 90%
            </span>
          </div>
        </div>
      ) : null}
      <Textarea
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
    </>
  );
};

export default QuestionPassage;
