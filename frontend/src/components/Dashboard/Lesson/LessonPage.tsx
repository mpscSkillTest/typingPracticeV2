import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { Subject, UserResult } from "@/types";
import {
	QuestionPassage,
	AnswerPassage,
	PassingInfoMessage,
	HighlightedPassage,
} from "../shared";
import {
	getUserResults,
	getHighlightIndexesForLesson,
} from "../../../utils/utils/passageUtils/getPassageUtils";
import { OnKeyDownArgs } from "../shared/AnswerPassage";
import {
	getLessonDetails,
	getLessonsList,
	submitLessonDetails,
	getStudentProgess,
} from "./api";
import { THRSHOLD_ACCURACY_FOR_LESSON } from "@/utils/constant";
import { PassageType } from "@/enums/PassageType";
import ImagePreviewDialog from "./ImagePreviewDialog";
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";

const LessonPage = () => {
	const [keystrokesCount, setKeystrokesCount] = useState<number>(0);
	const [backspacesCount, setBackspacesCount] = useState<number>(0);
	const [userInputText, setUserInputText] = useState<string>("");
	const [totalTypedWords, setTotalTypedWords] = useState<number>(0);
	const [resetTrigger, setResetTrigger] = useState(false);
	const [nextLessonId, setNextLessonId] = useState<number>(0);
	const [prevLessonId, setPrevLessonId] = useState<number>(0);
	const [correctWordIndices, setcorrectWordIndices] = useState<number[]>([]);
	const [wrongIndices, setWrongIndices] = useState<number[]>([]);
	const [shouldShowImageModal, setShouldShowImageModal] = useState(false);

	const userResult = useRef<UserResult>({});

	const passageWords = useRef<string[]>([]);

	const { toast } = useToast();

	const params = useParams<Record<"subject" | "id", string>>();

	const { subject: selectedSubject, id: lessonId } = params || {};
	const subject = selectedSubject?.toUpperCase?.() as Subject;
	const lessonIdClone = parseInt(lessonId as string);

	const { data: lessonListData, isPending: lessonListLoading } = useQuery({
		queryKey: ["allLessons", selectedSubject],
		queryFn: getLessonsList,
		retry: false,
	});

	const { isPending: lessonDetailsLoading, data: lessonData } = useQuery({
		queryKey: ["lessonData", subject, lessonIdClone],
		queryFn: getLessonDetails,
		retry: false,
	});

	const {
		isPending: studentResultLoading,
		data: studnentResultData,
		refetch: refetchStudentResults,
	} = useQuery({
		queryKey: ["studentProgress", selectedSubject],
		queryFn: getStudentProgess,
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

	const onPassageCheck = () => {
		const { correctIndices, wrongIndices } = getHighlightIndexesForLesson(
			lessonData?.lesson?.text || "",
			userInputText
		);
		setcorrectWordIndices(correctIndices);
		setWrongIndices(wrongIndices);
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

	const onUserInputChange = ({ updatedUserInputText = "" }) => {
		if (subject === "ENGLISH") {
			const totalTypedWords = updatedUserInputText
				?.trim?.()
				?.split?.(" ")
				?.filter(Boolean)?.length;
			setTotalTypedWords(totalTypedWords || 0);
		}
		setUserInputText(updatedUserInputText);
	};

	const focusOnAnswerPassage = () => {
		userInputRef.current?.focus();
	};

	const onSubmitPassage = async () => {
		const expectedWords =
			lessonData?.lesson?.text?.trim?.()?.split?.(" ")?.filter?.(Boolean) || [];

		const typedWords =
			userInputText?.trim?.()?.split?.(" ")?.filter?.(Boolean) || [];

		const result = getUserResults({
			typedWords,
			expectedWords,
			isLesson: true,
		});

		userResult.current = result;

		mutate({
			id: lessonIdClone,
			inputText: userInputText,
			passageText: lessonData?.lesson?.text || "",
			subject,
			duration: 0,
		});
	};

	const goToLesson = (type: "next" | "prev") => {
		const lowerCaseSubject = subject.toLowerCase();
		const gotoLessonId = type === "next" ? nextLessonId : prevLessonId;
		if (gotoLessonId) {
			navigate(`/lesson/${lowerCaseSubject}/${gotoLessonId}`);
		}
	};

	const toggleImageModal = () => {
		setShouldShowImageModal((prev) => !prev);
	};

	const isNextLessonValid = () => {
		if (!nextLessonId || !studnentResultData?.progress?.length) {
			return false;
		}

		return (
			studnentResultData.progress.findIndex?.((details) => {
				return details?.isCompleted && details?.id === Number(lessonId);
			}) !== -1
		);
	};

	const getImageDialogDom = () => {
		if (!shouldShowImageModal) return null;

		return (
			<ImagePreviewDialog
				shouldOpen={shouldShowImageModal}
				toggleOpen={toggleImageModal}
				imageUrl={lessonData?.lesson?.lessonImage}
			/>
		);
	};

	const getImageIconDom = () => {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Icons.Info
							className="cursor-pointer ml-2 inline-block"
							onClick={toggleImageModal}
						/>
					</TooltipTrigger>
					<TooltipContent side="left">
						<p>Show Lesson Image</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
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
			shouldDisable={!!userResult?.current?.totalTypedWords}
		/>
	);

	const getQuestionPassageDom = () => {
		if (!userResult.current?.correctWordIndices?.length) {
			return (
				<HighlightedPassage
					correctWordIndices={correctWordIndices || []}
					selectedPassageId={lessonData?.lesson?.id?.toString() || ""}
					questionPassage={lessonData?.lesson?.text || ""}
					passageType={PassageType.LESSON.name as keyof typeof PassageType}
					correctIndices={correctWordIndices}
					wrongIndices={wrongIndices}
				/>
			);
		}

		if (userResult.current?.correctWordIndices?.length) {
			return (
				<HighlightedPassage
					correctWordIndices={userResult.current.correctWordIndices || []}
					selectedPassageId={lessonData?.lesson?.id?.toString() || ""}
					questionPassage={lessonData?.lesson?.text || ""}
				/>
			);
		}
		return (
			<QuestionPassage
				selectedPassageId={lessonData?.lesson?.id || 0}
				questionPassage={lessonData?.lesson?.text || ""}
				onScrollFocus={focusOnAnswerPassage}
			/>
		);
	};

	const getResultTextDom = () => {
		if (!userResult?.current?.totalTypedWords) {
			return null;
		}
		const isCompleted =
			(userResult?.current?.accuracy as number) >= THRSHOLD_ACCURACY_FOR_LESSON;

		const accuracyText = userResult?.current?.accuracy?.toFixed?.(2);

		const commonClassNames =
			"flex items-start justify-center gap-2 text-md bg-green-100 rounded-2xl p-2 text-green-700 sm:flex-row sm:text-xl sm:items-center";

		if (isCompleted) {
			return (
				<div className={commonClassNames}>
					<Icons.LeaderBoard />
					<p>
						Great job! You have completed lesson with
						<span className="font-bold px-1">{`${accuracyText}%`}</span>
						accuracy
					</p>
				</div>
			);
		}

		return (
			<div className={`${commonClassNames} bg-red-100 text-red-700`}>
				<Icons.FrownIcon />
				<p>
					Accuracy is too low
					<span className="font-bold px-1">{`${accuracyText}%,`}</span>
					try again to improve your score
				</p>
			</div>
		);
	};

	useEffect(() => {
		if (resetTrigger) {
			userResult.current = {}; // Clear the user result (disables `shouldDisable`)\
			setResetTrigger(false); // Reset the trigger to prevent infinite loops
			setUserInputText(" ");
		}
	}, [resetTrigger]);

	useEffect(() => {
		if (!updatingLessonResult) {
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
			if (!isError) {
				refetchStudentResults();
			}
		}
	}, [updatingLessonResult]);

	useEffect(() => {
		onPassageCheck();
	}, [totalTypedWords, userInputText]);

	useEffect(() => {
		if (!lessonListLoading && !!lessonListData?.lessons?.length) {
			const currentLessonIndex = lessonListData.lessons.findIndex(
				(currentLesson) => {
					return currentLesson.id === lessonIdClone;
				}
			);

			const nextLessonDetails = lessonListData.lessons[currentLessonIndex + 1];

			const prevLessonDetails = lessonListData.lessons[currentLessonIndex - 1];

			setNextLessonId(nextLessonDetails?.id);
			setPrevLessonId(prevLessonDetails?.id);
		}
	}, [lessonListLoading]);

	useEffect(() => {
		if (!lessonDetailsLoading) {
			passageWords.current = lessonData?.lesson?.text?.split(" ") || [];
		}
	}, [lessonDetailsLoading]);

	if (lessonDetailsLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				<Icons.spinner height={48} width={48} className="animate-spin" />
			</div>
		);
	}

	return (
		<Card className="h-full border-none outline-none">
			<CardHeader>
				<CardTitle className="flex items-center justify-between px-1 font-semibold">
					{lessonData?.lesson?.title}
					{getImageIconDom()}
				</CardTitle>
			</CardHeader>
			{getImageDialogDom()}
			<CardContent>
				<div className="flex flex-col m-auto gap-5">
					{getQuestionPassageDom()}
					<div className="flex gap-[10px] flex-col items-center">
						{getAnswerPassageDom()}
						<PassingInfoMessage subject={subject} />
					</div>
					<div className="d-flex">
						<Button
							className="mx-4"
							style={{
								border: "2px solid #16245F",
								background: "white",
								color: "black",
							}}
							disabled={!prevLessonId}
							onClick={goToLesson.bind(this, "prev")}
						>
							Previous Lesson
						</Button>
						{!userResult?.current?.totalTypedWords ? (
							<Button
								disabled={!!shouldDisableUserInputText()}
								onClick={onSubmitPassage}
								showLoader={updatingLessonResult}
							>
								Submit
							</Button>
						) : (
							<Button onClick={() => setResetTrigger(true)}>Try Again</Button>
						)}
						<Button
							className="mx-4"
							style={{
								border: "2px solid #16245F",
								background: "white",
								color: "black",
							}}
							disabled={!isNextLessonValid()}
							onClick={goToLesson.bind(this, "next")}
						>
							Next Lesson
						</Button>
					</div>
					{getResultTextDom()}
				</div>
			</CardContent>
		</Card>
	);
};

export default LessonPage;
