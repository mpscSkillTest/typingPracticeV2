import { Lesson, LessonResult } from "@/types";

export const getFinalisedLessonsList = (
	lessonsList: Lesson[],
	progressDetails: LessonResult[]
): (Lesson & LessonResult)[] => {
	if (!lessonsList?.length) {
		return [];
	}

	if (!progressDetails?.length) {
		return lessonsList.map((lessonDetails) => {
			return {
				...lessonDetails,
				accuracy: 0,
				isCompleted: false,
			};
		});
	}

	const finalisedList: (Lesson & LessonResult)[] = [];

	const progressDetailsMap: Record<PropertyKey, LessonResult> = {};

	progressDetails.forEach((progress) => {
		progressDetailsMap[progress?.id] = progress;
	});

	lessonsList.map((lessonDetails) => {
		if (progressDetailsMap?.hasOwnProperty?.(lessonDetails?.id)) {
			finalisedList.push({
				...lessonDetails,
				...progressDetailsMap?.[lessonDetails?.id],
			});
		} else {
			finalisedList.push({
				...lessonDetails,
				isCompleted: false,
				accuracy: 0,
			});
		}
	});

	return finalisedList;
};
