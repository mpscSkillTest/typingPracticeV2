import classes from "./commonStyles.module.scss";

type Props = {
  selectedPassageId?: string;
  questionPassage?: string;
  correctWordIndices: number[];
};

const HighlightedPassage = ({
  selectedPassageId,
  questionPassage,
  correctWordIndices,
}: Props) => {
  if (!selectedPassageId || !questionPassage) {
    return null;
  }

  const expectedWords =
    questionPassage?.trim?.()?.split(" ").filter(Boolean) || [];

  if (!expectedWords?.length) {
    return null;
  }

  return (
    <div
      key={`highlighted-passage-${selectedPassageId}`}
      className={` w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50  overflow-y-auto flex flex-wrap gap-1 rounded-md focus-visible:ring-offset-2 h-[200px] font-medium text-md text-black leading-[1.5] ${classes.passageText}`}
    >
      {expectedWords.map((word, index) => {
        if (correctWordIndices?.includes(index)) {
          return <span className="text-[22px]  text-green-500">{word}</span>;
        }
        return <span className="text-[22px] text-red-500">{word}</span>;
      })}
    </div>
  );
};

export default HighlightedPassage;
