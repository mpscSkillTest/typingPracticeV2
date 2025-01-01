import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Subject } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { getLessonsList, getStudentProgess, getStudentDetails } from "./api";
import { getFinalisedLessonsList } from "./utils";

const Lesson = () => {
	const navigate = useNavigate();
	const [selectedSubject, setSelectedSubject] = useState<Subject>("MARATHI");

	const { isPending: studentDataLoading, data: studentData } = useQuery({
		queryKey: ["studentData"],
		queryFn: getStudentDetails,
		retry: false,
	});

	const { isPending: lessonsListLoading, data: lessonListData } = useQuery({
		queryKey: ["allLessons", selectedSubject],
		queryFn: getLessonsList,
		retry: false,
	});

	const { isPending: studentResultLoading, data: studnentResultData } =
		useQuery({
			queryKey: ["studentProgress", selectedSubject],
			queryFn: getStudentProgess,
			retry: false,
		});

	const availableLessons = lessonListData?.lessons || [];

	const studentProgress = studnentResultData?.progress || [];

	const isDetailsLoading = lessonsListLoading || studentResultLoading;

	const finalisedLessonList = useMemo(
		() => getFinalisedLessonsList(availableLessons, studentProgress),
		[studentResultLoading, lessonsListLoading, selectedSubject]
	);

	const onTabChange = (updatedSubject: Subject) => {
		setSelectedSubject(updatedSubject);
	};

	const gotoLesson = (isLocked: boolean, id: number) => {
		if (!isLocked) {
			navigate(`/lesson/${selectedSubject?.toLowerCase()}/${id}`);
		}
		return;
	};

	const getStatusDom = (isCompleted: boolean, isLocked: boolean) => {
		let statusDom = null;

		if (isCompleted) {
			statusDom = <Icons.MedalIcon height={36} width={36} />;
		} else if (isLocked) {
			statusDom = <Icons.BookLockIcon height={36} width={36} />;
		} else {
			statusDom = <Icons.BookKeyIcon height={36} width={36} />;
		}
		return statusDom;
	};

	const getAccuracyDom = (
		accuracy: number,
		isCompleted: boolean,
		isLocked: boolean,
		isRestricted: boolean
	) => {
		let isLimitedAccess = false;

		if (selectedSubject === "ENGLISH") {
			isLimitedAccess = !!(
				isRestricted && studentData?.user?.isLimitedAccessForEnglish
			);
		} else if (selectedSubject === "MARATHI") {
			isLimitedAccess = !!(
				isRestricted && studentData?.user?.isLimitedAccessForMarathi
			);
		}

		if (isLimitedAccess) {
			return (
				<p className="text-sm text-muted-foreground">
					This lesson is not accessible. Subscribe to unlock all lessons!
				</p>
			);
		}

		if (isLocked) {
			return (
				<p className="text-sm text-gray-600">
					Complete the previous lesson to unlock this one
				</p>
			);
		}

		if (!accuracy) {
			return (
				<p className="text-sm text-gray-600">
					Start your journey with this lesson!
				</p>
			);
		}

		if (!isCompleted) {
			return (
				<div className="flex flex-col gap-2">
					<p className="font-semibold tracking-tight text-xl">
						Accuracy: {accuracy}%
					</p>
					<p className="text-sm text-muted-foreground">
						Keep going! Practice makes person perfect
					</p>
				</div>
			);
		}

		return (
			<p className="font-semibold tracking-tight text-xl">
				Great job! Accuracy: {accuracy}%
			</p>
		);
	};

	const getLessonListDom = () => {
		if (isDetailsLoading) {
			return (
				<div className="flex justify-center items-center h-full">
					<Icons.spinner height={48} width={48} className="animate-spin" />
				</div>
			);
		}

		if (!finalisedLessonList?.length) {
			return (
				<div className="flex items-center justify-center">No Records Found</div>
			);
		}

		return (
			<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-4">
				{finalisedLessonList.map(
					({ id, isCompleted, isLocked, accuracy, isRestricted }, index) => {
						return (
							<Card
								key={id}
								onClick={gotoLesson.bind(this, isLocked, id)}
								className={`capitalize
						 	${
								isLocked
									? "cursor-not-allowed shadow-none bg-slate-200"
									: "hover:shadow-lg bg-slate-50"
							}
							${isCompleted ? "bg-green-100" : ""} 
							 text-gray-800 text-xl font-semibold`}
							>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										{getStatusDom(isCompleted, isLocked)}
										{selectedSubject === "ENGLISH" ? "English" : "Marathi"}{" "}
										Lesson
										{` ${index + 1}`}
									</CardTitle>
								</CardHeader>
								<CardContent>
									{getAccuracyDom(
										accuracy,
										isCompleted,
										isLocked,
										isRestricted
									)}
								</CardContent>
							</Card>
						);
					}
				)}
			</div>
		);
	};

	const { name = "Student" } = studentData?.user || {};

	if (studentDataLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				<Icons.spinner height={48} width={48} className="animate-spin" />
			</div>
		);
	}

	const getTabContentDom = (subject: Subject) => {
		return (
			<TabsContent value={subject} className="h-full space-y-4">
				<div className="max-h-[100%] p-4 overflow-y-auto">
					{getLessonListDom()}
				</div>
			</TabsContent>
		);
	};

	return (
		<>
			<div className="min-h-[100%] overflow-hidden p-4 sm:p-6">
				<div className="text-2xl font-bold text- mb-4 text-center sm:text-left">
					Welcome, {name}
				</div>
				<div className="flex-1 space-y-4 py-2">
					<Tabs
						value={selectedSubject}
						defaultValue="MARATHI"
						className="flex-1 space-y-4"
					>
						<TabsList className="h-[64px] w-[240px] my-[20px]">
							<TabsTrigger
								onClick={onTabChange.bind(this, "MARATHI")}
								className="h-full w-[50%]"
								value="MARATHI"
							>
								Marathi
							</TabsTrigger>
							<TabsTrigger
								onClick={onTabChange.bind(this, "ENGLISH")}
								className="h-full w-[50%]"
								value="ENGLISH"
							>
								English
							</TabsTrigger>
						</TabsList>
						{getTabContentDom("MARATHI")}
						{getTabContentDom("ENGLISH")}
					</Tabs>
				</div>
			</div>
		</>
	);
};

export default Lesson;
