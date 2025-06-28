import { Lesson, LessonResult } from "@/types";

export const getFinalisedLessonsList = (
	lessonsList: Lesson[],
	progressDetails: LessonResult[]
): (Lesson & LessonResult)[] => {
	if (!lessonsList?.length) {
		return [];
	}

	if (!progressDetails?.length) {
		return lessonsList.map((lessonDetails, index) => {
			return {
				...lessonDetails,
				accuracy: 0,
				// TODO: to remove post testing
				isCompleted: false,
				// isCompleted: true,
				isLocked: index !== 0,
				// isLocked: false,
			};
		});
	}

	const finalisedList: (Lesson & LessonResult)[] = [];

	const progressDetailsMap: Record<PropertyKey, LessonResult> = {};

	progressDetails.forEach((progress) => {
		progressDetailsMap[progress?.id] = progress;
	});

	let lastCompletedLesson = -1;
	lessonsList.forEach((lessonDetails, index) => {
		if (progressDetailsMap?.hasOwnProperty?.(lessonDetails?.id)) {
			if (progressDetailsMap?.[lessonDetails?.id]?.isCompleted) {
				lastCompletedLesson = index;
			}

			finalisedList.push({
				...lessonDetails,
				...progressDetailsMap?.[lessonDetails?.id],
				accuracy: Number(
					progressDetailsMap?.[lessonDetails?.id]?.accuracy?.toFixed(2)
				),
				// TODO: to remove post testing
				isLocked: lastCompletedLesson + 1 < index,
				// isLocked: false,
				// isCompleted: true,
			});
		} else {
			finalisedList.push({
				...lessonDetails,
				isCompleted: false,
				accuracy: 0,
				// TODO: to remove post testing
				isLocked: lastCompletedLesson + 1 < index,
				// isLocked: false,
				// isCompleted: true,
			});
		}
	});

	return finalisedList;
};
