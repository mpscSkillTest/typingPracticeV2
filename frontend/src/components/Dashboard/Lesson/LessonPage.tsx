import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { Subject, UserResult } from "@/types";
import { QuestionPassage, AnswerPassage, PassingInfoMessage } from "../shared";
import { getUserResults } from "../../../utils/utils/passageUtils/getPassageUtils";
import { OnKeyDownArgs } from "../shared/AnswerPassage";
import { getLessonDetails, submitLessonDetails } from "./api";

const LessonPage = () => {
	const [keystrokesCount, setKeystrokesCount] = useState<number>(0);
	const [backspacesCount, setBackspacesCount] = useState<number>(0);
	const [userInputText, setUserInputText] = useState<string>("");
	const [totalTypedWords, setTotalTypedWords] = useState<number>(0);

	const userResult = useRef<UserResult>({});

	const { toast } = useToast();

	const params = useParams<Record<"subject" | "id", string>>();

	const { subject: selectedSubject, id: lessonId } = params || {};
	const subject = selectedSubject?.toUpperCase?.() as Subject;
	const lessonIdClone = parseInt(lessonId as string);

	const { isPending: lessonDetailsLoading, data: lessonData } = useQuery({
		queryKey: ["lessonData", subject, lessonIdClone],
		queryFn: getLessonDetails,
		retry: false,
	});

	const {
		mutate,
		isPending: updatingLessonResult,
		isError,
	} = useMutation({
		mutationFn: submitLessonDetails,
	});

	const navigate = useNavigate();
	const userInputRef = useRef<HTMLTextAreaElement>(null);

	if (!lessonDetailsLoading && !lessonData?.lesson) {
		navigate("/lesson");
	}

	const shouldDisableUserInputText = () => {
		return typeof userInputText !== "string" || userInputText === "";
	};

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

	const onSubmitPassage = async () => {
		const expectedWords =
			lessonData?.lesson?.text?.trim?.()?.split?.(" ")?.filter?.(Boolean) || [];

		const typedWords =
			userInputText?.trim?.()?.split?.(" ")?.filter?.(Boolean) || [];

		const result = getUserResults({ typedWords, expectedWords });

		userResult.current = result;

		mutate({
			id: lessonIdClone,
			inputText: userInputText,
			passageText: lessonData?.lesson?.text || "",
			subject,
			duration: 0,
		});
	};

	useEffect(() => {
		if (isError) {
			toast({
				variant: "destructive",
				title: "You have exhausted your free trial limit",
				description:
					"To retain your lesson progress and to use our other exciting features, please consider to subscribe our Premium Package",
				duration: 3000,
				className: "absolute",
			});
		}
	}, [updatingLessonResult]);

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
			<Button
				disabled={!!shouldDisableUserInputText()}
				onClick={onSubmitPassage}
				showLoader={updatingLessonResult}
			>
				Submit
			</Button>
		</div>
	);
};

export default LessonPage;
