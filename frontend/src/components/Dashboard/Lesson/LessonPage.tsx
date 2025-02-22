import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
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
import { getUserResults } from "../../../utils/utils/passageUtils/getPassageUtils";
import { OnKeyDownArgs } from "../shared/AnswerPassage";
import { getLessonDetails, getLessonsList, submitLessonDetails } from "./api";
import { THRSHOLD_ACCURACY_FOR_LESSON } from "@/utils/constant";

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
	
	type Lesson = {
		id: number;
		title: string;
		text: string;
		isRestricted: boolean;
	};

	const { data: lessonListData } = useQuery({
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

 


	const goToNextLesson = (isLocked: boolean) => {
		if (!lessonListData || typeof lessonListData !== "object") return;
		const lessonArray = Object.values(lessonListData)
			.flat()
			.filter((lesson): lesson is Lesson =>
				lesson && typeof lesson === "object" &&
				"id" in lesson && typeof lesson.id === "number" &&
				"title" in lesson && "text" in lesson && "isRestricted" in lesson
			);
		const sortedLessons = lessonArray.sort((a, b) => a.id - b.id);
		const currentIndex = sortedLessons.findIndex(lesson => lesson.id === lessonIdClone);
		const lowerCaseSubject = subject.toLowerCase();
		if (currentIndex !== -1 && currentIndex < sortedLessons.length - 1) {
			const nextLesson = sortedLessons[currentIndex + 1];
			if (!isLocked) {
				navigate(`/lesson/${lowerCaseSubject}/${nextLesson.id}`);
			}else{
				alert("Complete this lesson to move forward for next lesson ")
			}
		} 
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

	const getQuestionPassageDom = () =>
		userResult.current?.correctWordIndices?.length ? (
			<HighlightedPassage
				correctWordIndices={userResult.current.correctWordIndices || []}
				selectedPassageId={lessonData?.lesson?.id?.toString() || ""}
				questionPassage={lessonData?.lesson?.text || ""}
			/>
		) : (
			<QuestionPassage
				selectedPassageId={lessonData?.lesson?.id || 0}
				questionPassage={lessonData?.lesson?.text || ""}
				onScrollFocus={focusOnAnswerPassage}
			/>
		);

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
		<Card className="h-full border-none outline-none">
			<CardHeader>
				<CardTitle>{lessonData?.lesson?.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col m-auto gap-5">
					{getQuestionPassageDom()}
					<div className="flex gap-[10px] flex-col items-center">
						{getAnswerPassageDom()}
						<PassingInfoMessage subject={subject} />
					</div>
					<div className="d-flex">
						{!userResult?.current?.totalTypedWords ? (
							<Button
								disabled={!!shouldDisableUserInputText()}
								onClick={onSubmitPassage}
								showLoader={updatingLessonResult}
							>
								Submit
							</Button>
						) : (
							<Button onClick={() => window.location.reload()}>
								Try Again
							</Button>
						)}
						<Button className="ml-4" style={{ border: "2px solid #16245F", background :"white", color:"black" }} onClick={goToNextLesson} >
							Next Lesson
						</Button>
					</div>
					{getResultTextDom()}
					{lessonData?.lesson?.lessonImage ? (
						<img
							style={{
								alignSelf: "center",
								height: 340,
								width: 600,
							}}
							src={lessonData.lesson.lessonImage}
						/>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
};

export default LessonPage;
