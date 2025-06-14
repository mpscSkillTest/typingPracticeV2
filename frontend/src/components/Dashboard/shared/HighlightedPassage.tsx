import { PassageType } from "@/enums/PassageType";
import classes from "./commonStyles.module.scss";

type Props = {
	selectedPassageId?: string;
	questionPassage?: string;
	correctWordIndices: number[];
	passageType?: keyof typeof PassageType;
	totalTypedWords?: number;
};

const HighlightedPassage = ({
	selectedPassageId,
	questionPassage,
	correctWordIndices,
	passageType,
	totalTypedWords = 0,
}: Props) => {
	if (!selectedPassageId || !questionPassage) {
		return null;
	}

	const expectedWords =
		questionPassage?.trim?.()?.split(" ").filter(Boolean) || [];

	if (!expectedWords?.length) {
		return null;
	}

	const getWordDom = (word: string, index: number) => {
		if (correctWordIndices?.includes?.(index)) {
			return <span className="text-[22px]  text-green-500">{word}</span>;
		}
		const isLesson = passageType === PassageType.LESSON.name;
		const shouldCheckCorrection =
			!isLesson || (totalTypedWords && isLesson && index <= totalTypedWords);
		const isIncorrectword =
			shouldCheckCorrection && !correctWordIndices?.includes?.(index);

		if (isIncorrectword) {
			return <span className="text-[22px] text-red-500">{word}</span>;
		}
		return <span className="text-[22px] text-black">{word}</span>;
	};

	return (
		<div
			key={`highlighted-passage-${selectedPassageId}`}
			className={` w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50  overflow-y-auto flex flex-wrap gap-1 rounded-md focus-visible:ring-offset-2 h-[200px] font-medium text-md text-black leading-[1.5] ${classes.passageText}`}
		>
			{expectedWords.map(getWordDom)}
		</div>
	);
};

export default HighlightedPassage;
