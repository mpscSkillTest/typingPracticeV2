import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Subject } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{finalisedLessonList.map(({ id, title, isCompleted, isLocked }) => {
					let statusDom = null;

					if (isCompleted) {
						statusDom = (
							<span className="text-green-600 font-bold">✓ Completed</span>
						);
					} else if (isLocked) {
						statusDom = <span className="text-gray-500">Locked</span>;
					}

					return (
						<div
							key={id}
							onClick={() => {
								if (!isLocked) {
									navigate(`/lesson/${selectedSubject?.toLowerCase()}/${id}`);
								}
								return;
							}}
							className={`p-4 rounded-md shadow-md cursor-pointer ${
								isCompleted ? "bg-green-100" : "bg-gray-100"
							} hover:shadow-lg`}
						>
							<div className="text-center">
								<div className="text-gray-800 text-xl font-semibold">{id}</div>
								<div className="mt-2 text-sm text-gray-600">{title}</div>
								<div className="mt-2">{statusDom}</div>
							</div>
						</div>
					);
				})}
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
				<div className="max-h-[calc(100dvh-224px)] bg-white border-black p-4 rounded-md shadow-md overflow-y-auto">
					{getLessonListDom()}
				</div>
			</TabsContent>
		);
	};

	return (
		<>
			<div className="min-h-[100%] overflow-hidden bg-gray-100 p-4 sm:p-6">
				<div className="text-2xl font-bold text- mb-4 text-center sm:text-left">
					Welcome, {name}
				</div>
				<div className="flex-1 space-y-4 px-4 py-2">
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
