import { Lesson, LessonResult } from "@/types";
import axios from "../../../config/customAxios";
import { QueryFunctionContext } from "@tanstack/react-query";

export type LessonResponse = {
	lessons: Lesson[];
	error?: Error;
};

export type StudentProgress = {
	progress: LessonResult[];
	error?: Error;
};

export const getLessonsList = async (
	params: QueryFunctionContext
): Promise<LessonResponse> => {
	const response = await axios.post("/student/lessons/", {
		subject: params?.queryKey?.[1],
	});
	if (response?.data?.error) {
		throw new Error(response.data.error);
	}
	return response.data;
};

export const getStudentProgess = async (
	params: QueryFunctionContext
): Promise<StudentProgress> => {
	const response = await axios.post("/student/lesson-results", {
		subject: params?.queryKey?.[1],
	});
	if (response?.data?.error) {
		throw new Error(response.data.error);
	}
	return response.data;
};
