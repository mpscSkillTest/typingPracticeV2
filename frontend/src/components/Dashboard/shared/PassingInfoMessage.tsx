import { Icons } from "@/components/ui/icons";
import type { Subject } from "../../../types";

type Props = {
  subject?: Subject;
  shouldShowInfo?: boolean;
};

const PassingInfoMessage = ({ subject, shouldShowInfo }: Props) => {
  if (!shouldShowInfo) {
    return null;
  }

  let minimumKeystrokes = 1500;
  if (subject === "ENGLISH") {
    minimumKeystrokes = 2000;
  }

  return (
    <div className="flex flex-col gap-2 my-2 text-xs font-medium">
      <div className="flex gap-1 items-center">
        <Icons.BadgeInfo height={14} width={14} />
        Exam Passing criteria
      </div>
      <div className="flex flex-col gap-2">
        <span>
          <b>Open Category</b>: Minimum {minimumKeystrokes} Keystrokes and
          Accuracy greater than or equal to 93% for first
          {` ${minimumKeystrokes} `}
          Keystrokes
        </span>
        <span>
          <b>Reserved Category</b>: Minimum {minimumKeystrokes} Keystrokes and
          Accuracy greater than or equal to 90% for first
          {` ${minimumKeystrokes} `}
          Keystrokes
        </span>
      </div>
    </div>
  );
};

export default PassingInfoMessage;
