import { Icons } from "@/components/ui/icons";
import {
  MPSC_ACCURACY_FOR_OPEN,
  MPSC_ACCURACY_FOR_RESERVED,
  MPSC_ENGLISH_KEYSTROKES_FOR_OPEN,
  MPSC_ENGLISH_KEYSTROKES_FOR_RESERVED,
  MPSC_MARATHI_KEYSTROKES_FOR_OPEN,
  MPSC_MARATHI_KEYSTROKES_FOR_RESERVED,
} from "../../../utils/constant";
import type { Subject } from "../../../types";

type Props = {
  subject?: Subject;
  shouldShowInfo?: boolean;
};

const PassingInfoMessage = ({ subject, shouldShowInfo }: Props) => {
  if (!shouldShowInfo) {
    return null;
  }

  let keystrokesForOpen = MPSC_MARATHI_KEYSTROKES_FOR_OPEN;
  let keystrokesForReserved = MPSC_MARATHI_KEYSTROKES_FOR_RESERVED;

  if (subject === "ENGLISH") {
    keystrokesForOpen = MPSC_ENGLISH_KEYSTROKES_FOR_OPEN;
    keystrokesForReserved = MPSC_ENGLISH_KEYSTROKES_FOR_RESERVED;
  }

  return (
    <div className="flex flex-col gap-2 my-2 text-xs font-medium">
      <div className="flex gap-1 items-center">
        <Icons.BadgeInfo height={14} width={14} />
        Exam Passing criteria
      </div>
      <div className="flex flex-col gap-2">
        <span>
          <b>Open Category</b>: Minimum {`${keystrokesForOpen} `}
          Keystrokes and Accuracy greater than or equal to
          {` ${MPSC_ACCURACY_FOR_OPEN}`}% for first
          {` ${keystrokesForOpen} `}
          Keystrokes
        </span>
        <span>
          <b>Reserved Category</b>: Minimum {`${keystrokesForReserved} `}{" "}
          Keystrokes and Accuracy greater than or equal to
          {` ${MPSC_ACCURACY_FOR_RESERVED}`}% for first
          {` ${keystrokesForReserved} `}
          Keystrokes
        </span>
      </div>
    </div>
  );
};

export default PassingInfoMessage;
