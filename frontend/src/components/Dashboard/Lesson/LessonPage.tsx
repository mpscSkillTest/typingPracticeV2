import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Subject } from "@/types";
import { QuestionPassage, AnswerPassage, PassingInfoMessage } from "../shared";
import { OnKeyDownArgs } from "../shared/AnswerPassage";
import { getLessonDetails } from "./api";

const LessonPage = () => {
	const [keystrokesCount, setKeystrokesCount] = useState<number>(0);
	const [backspacesCount, setBackspacesCount] = useState<number>(0);
	const [userInputText, setUserInputText] = useState<string>("");
	const [totalTypedWords, setTotalTypedWords] = useState<number>(0);

	const params = useParams<Record<"subject" | "id", string>>();

	const { subject: selectedSubject, id: lessonId } = params || {};
	const subject = selectedSubject?.toUpperCase?.() as Subject;

	const { isPending: lessonDetailsLoading, data: lessonData } = useQuery({
		queryKey: ["lessonData", subject, lessonId],
		queryFn: getLessonDetails,
		retry: false,
	});

	const navigate = useNavigate();
	const userInputRef = useRef<HTMLTextAreaElement>(null);

	if (!lessonDetailsLoading && !lessonData?.lesson) {
		navigate("/lesson");
	}

	const onUserInputKeyDown = ({
		updatedBackspacesCount = 0,
		updatedTypedWordsCount = 0,
		updatedKeystrokesCount = 0,
		updatedUserInputText = "",
	}: OnKeyDownArgs) => {
		if (subject === "ENGLISH") {
			setBackspacesCount(updatedBackspacesCount);
			setKeystrokesCount(updatedKeystrokesCount);
		}

		if (subject === "MARATHI") {
			setKeystrokesCount(updatedKeystrokesCount);
			setTotalTypedWords(updatedTypedWordsCount);
			setBackspacesCount(updatedBackspacesCount);
			setUserInputText(updatedUserInputText);
		}
	};

	const onUserInputChange = ({ updatedUserInputText = "" }: any) => {
		setUserInputText(updatedUserInputText);
	};

	const focusOnAnswerPassage = () => {
		userInputRef.current?.focus();
	};

	const getAnswerPassageDom = () => (
		<AnswerPassage
			subject={subject as Subject}
			onKeyDown={onUserInputKeyDown}
			onChange={onUserInputChange}
			totalTypedWords={totalTypedWords}
			keystrokesCount={keystrokesCount}
			backspacesCount={backspacesCount}
			userInputText={userInputText}
			userInputRef={userInputRef}
		/>
	);

	const getQuestionPassageDom = () => (
		<QuestionPassage
			selectedPassageId={lessonData?.lesson?.id as number}
			questionPassage={lessonData?.lesson?.text as string}
			onScrollFocus={focusOnAnswerPassage}
		/>
	);

	if (lessonDetailsLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				<Icons.spinner height={48} width={48} className="animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex flex-col m-auto gap-5 p-4 xl:max-w-[50%]">
			{getQuestionPassageDom()}
			<div className="flex gap-[10px] flex-col items-center">
				{getAnswerPassageDom()}
				<PassingInfoMessage subject={"ENGLISH"} />
			</div>
			<Button>Submit Passage</Button>
		</div>
	);
};

export default LessonPage;
