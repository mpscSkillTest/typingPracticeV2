import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  keystrokesCount?: number;
  errorCount?: number;
  backspaceCount?: number;
  totalWordsCount: number;
  typedWordsCount?: number;
  pendingWordsCount?: number;
  accuracy?: number;
};

const Result = ({
  keystrokesCount = 0,
  errorCount = 0,
  backspaceCount = 0,
  totalWordsCount,
  typedWordsCount = 0,
  pendingWordsCount = 0,
  accuracy = 0,
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
  return (
    <div className="flex h-full w-full flex-col gap-[20px]">
      <div className="flex flex-col p-[20px] gap-[10px] rounded-lg border-2 justify-between flex-1">
        {getResultInputDom("Total words", totalWordsCount, "fixed")}
        {getResultInputDom("Typed Words", typedWordsCount)}
        {getResultInputDom("Pending Words", pendingWordsCount)}
        {getResultInputDom("Keystrokes", keystrokesCount)}
        {getResultInputDom("Backspaces", backspaceCount)}
        {getResultInputDom("Errors", errorCount, "destructive")}
        {getResultInputDom(
          "Accuracy",
          `${accuracy?.toFixed(2) || 0}%`,
          "success"
        )}
      </div>
    </div>
  );
};

export default Result;
