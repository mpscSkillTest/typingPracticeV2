import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Subject } from "@/types";
import { getLessonsList, getStudentProgess } from "./api";
import { getFinalisedLessonsList } from "./utils";

const Lesson = () => {
	const navigate = useNavigate();
	const [selectedSubject, setSelectedSubject] = useState<Subject>("ENGLISH");

	const { isPending: lessonsListLoading, data: lessonListData } = useQuery({
		queryKey: ["allLessons", selectedSubject],
		queryFn: getLessonsList,
	});

	const { isPending: studentResultLoading, data: studnentResultData } =
		useQuery({
			queryKey: ["studentProgress", selectedSubject],
			queryFn: getStudentProgess,
		});

	const availableLessons = lessonListData?.lessons || [];

	const studentProgress = studnentResultData?.progress || [];

	const finalisedLessonList = useMemo(
		() => getFinalisedLessonsList(availableLessons, studentProgress),
		[studentResultLoading, lessonsListLoading]
	);

	return (
		<div className="min-h-[100%] overflow-hidden bg-gray-100 p-4 sm:p-6">
			<div className="text-2xl font-bold text- mb-4 text-center sm:text-left">
				Welcome, Student
			</div>
			<div className="text-gray-600 mb-6 text-center sm:text-left">
				<span>0% progress | 0 stars | 2,000 points</span>
			</div>
			<div className="max-h-[calc(100dvh-224px)] bg-white border-black p-4 rounded-md shadow-md overflow-y-auto">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{finalisedLessonList.map(({ id, title, isCompleted }) => (
						<div
							key={id}
							onClick={() =>
								navigate(`/lesson/${selectedSubject?.toLowerCase()}/${id}`)
							}
							className={`p-4 rounded-md shadow-md cursor-pointer ${
								isCompleted ? "bg-green-100" : "bg-gray-100"
							} hover:shadow-lg`}
						>
							<div className="text-center">
								<div className="text-gray-800 text-xl font-semibold">{id}</div>
								<div className="mt-2 text-sm text-gray-600">{title}</div>
								<div className="mt-2">
									{isCompleted ? (
										<span className="text-green-600 font-bold">
											✓ Completed
										</span>
									) : (
										<span className="text-gray-500">Locked</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Lesson;
