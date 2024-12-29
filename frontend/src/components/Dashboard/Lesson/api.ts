import { Lesson, LessonResult, UserDetails } from "@/types";
import axios from "../../../config/customAxios";
import { QueryFunctionContext } from "@tanstack/react-query";

export type LessonResponse = {
	lessons: Lesson[];
	error?: Error;
};

export type LessonDetailsResponse = {
	lesson: Lesson;
	error?: Error;
};

export type StudentProgress = {
	progress: LessonResult[];
	error?: Error;
};

export type StudentDetailsResponse = {
	user: UserDetails;
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

export const getStudentDetails = async (): Promise<StudentDetailsResponse> => {
	const response = await axios.post("/student/details");
	if (response?.data?.error) {
		throw new Error(response.data.error);
	}
	return response.data;
};

export const getLessonDetails = async (
	params: QueryFunctionContext
): Promise<LessonDetailsResponse> => {
	const response = await axios.post("/student/lesson-details/", {
		subject: params?.queryKey?.[1],
		id: params?.queryKey?.[2],
	});
	if (response?.data?.error) {
		throw new Error(response.data.error);
	}
	return response.data;
};
