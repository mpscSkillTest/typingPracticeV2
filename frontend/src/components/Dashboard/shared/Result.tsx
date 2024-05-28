import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
  keystrokesCount?: number;
  errorCount?: number;
  backspaceCount?: number;
  totalWordsCount: number;
  typedWordsCount?: number;
  pendingWordsCount?: number;
  accuracy?: number;
  mpscAccuracy?: number;
  mpscErrorCount?: number;
  subject?: Subject;
  showResult: boolean;
};

const Result = ({
  keystrokesCount = 0,
  errorCount = 0,
  backspaceCount = 0,
  totalWordsCount,
  typedWordsCount = 0,
  pendingWordsCount = 0,
  accuracy = 0,
  mpscAccuracy = 0,
  mpscErrorCount = 0,
  subject,
  showResult,
}: Props) => {
  const getResultInputDom = (
    label: string,
    value: number | string,
    type?: string = "default"
  ) => {
    let labelDom = <Label>{label}</Label>;
    let valueDom = <div className="text-2xl font-bold">{value}</div>;
    if (type === "destructive") {
      labelDom = <Label className="text-red-500">{label}</Label>;
      valueDom = <div className="text-2xl font-bold text-red-500">{value}</div>;
    }

    if (type === "success") {
      labelDom = <Label className=" text-green-500">{label}</Label>;
      valueDom = (
        <div className="text-2xl font-bold text-green-500">{value}</div>
      );
    }

    if (type === "fixed") {
      labelDom = <Label className="text-gray-500">{label}</Label>;
      valueDom = (
        <div className="text-2xl font-bold text-gray-500">{value}</div>
      );
    }

    return (
      <Card className="max-h-max">
        <CardContent className="flex flex-wrap h-max gap-[10px] p-3 items-center justify-between">
          {labelDom}
          {valueDom}
        </CardContent>
      </Card>
    );
  };

  let resultForOpen = null;
  let resultForCategory = null;

  switch (subject) {
    case "ENGLISH":
      resultForOpen =
        keystrokesCount >= MPSC_ENGLISH_KEYSTROKES_FOR_OPEN &&
        mpscAccuracy >= MPSC_ACCURACY_FOR_OPEN;
      resultForCategory =
        keystrokesCount >= MPSC_ENGLISH_KEYSTROKES_FOR_RESERVED &&
        mpscAccuracy >= MPSC_ACCURACY_FOR_RESERVED;
      break;
    case "MARATHI":
      resultForOpen =
        keystrokesCount >= MPSC_MARATHI_KEYSTROKES_FOR_OPEN &&
        mpscAccuracy >= MPSC_ACCURACY_FOR_OPEN;
      resultForCategory =
        keystrokesCount >= MPSC_MARATHI_KEYSTROKES_FOR_RESERVED &&
        mpscAccuracy >= MPSC_ACCURACY_FOR_RESERVED;
      break;
    default:
      break;
  }

  return (
    <div className="flex h-full w-full flex-col gap-[20px]">
      <div className="flex flex-col p-[20px] gap-[10px] rounded-lg border-2 justify-between flex-1">
        {getResultInputDom("Total words", totalWordsCount, "fixed")}
        {getResultInputDom("Typed Words", typedWordsCount)}
        {getResultInputDom("Pending Words", pendingWordsCount)}
        {getResultInputDom("Keystrokes", keystrokesCount)}
        {getResultInputDom("Backspaces", backspaceCount)}
        {showResult ? (
          <>
            {getResultInputDom("Errors", errorCount, "destructive")}
            {getResultInputDom(
              "Accuracy",
              `${accuracy?.toFixed(2) || 0}%`,
              "success"
            )}
            {getResultInputDom(
              "Errors As Per MPSC",
              mpscErrorCount,
              "destructive"
            )}
            {getResultInputDom(
              "Accuracy As Per MPSC",
              `${mpscAccuracy?.toFixed(2) || 0}%`,
              "success"
            )}
            {getResultInputDom(
              "For Open Category",
              `${resultForOpen ? "Pass" : "Fail"}`,
              `${resultForOpen ? "success" : "destructive"}`
            )}
            {getResultInputDom(
              "For Reserved Category",
              `${resultForCategory ? "Pass" : "Fail"}`,
              `${resultForCategory ? "success" : "destructive"}`
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Result;
