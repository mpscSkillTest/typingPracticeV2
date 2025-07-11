import { supabase } from "../dbClient.js";
import logger from "../utils/logger.js";
import { THRSHOLD_ACCURACY_FOR_LESSON } from "../constant.js";

export const getAccessTokenFromHeaders = (req) => {
	return req?.headers?.authorization || "";
};

export const getUserIdFromToken = async (req) => {
	const accessToken = getAccessTokenFromHeaders(req);
	logger.info(
		`accessing getUserIdFromToken method for accessToke:=> ${accessToken}`
	);
	if (!accessToken) {
		logger.error(`missing access token in getUserIdFromToken method`);
		return null;
	}

	/**
	 * Handling for access token set in cookie of browser
	 */
	const { data, error } = await supabase.auth.getUser(accessToken);
	if (error || !data?.user?.id) {
		logger.error(`getUserIdFromToken method user failed due ${error?.message}`);
		logger.error(`no user found for access token: ${accessToken}`);
		return null;
	}

	logger.info(`user found with user id:=> ${data?.user?.id}`);

	return data?.user?.id;
};

export const getDailyAvg = (reportData) => {
	const uniqueDayDetails = {};
	reportData.forEach((report) => {
		const {
			date,
			accuracy = 0,
			backspacesCount = 0,
			errorsCount = 0,
			keystrokesCount = 0,
		} = report || {};
		if (date) {
			const previousDayDetails = uniqueDayDetails[date];
			if (previousDayDetails) {
				const {
					accuracy: prevAccuracy = 0,
					backspacesCount: prevBackspacesCount = 0,
					errorsCount: prevErrorsCount = 0,
					keystrokesCount: prevKeystrokesCount = 0,
					count: prevCount,
				} = previousDayDetails || {};

				const updatedDayDetails = {
					accuracy: prevAccuracy + accuracy || 0,
					backspacesCount: prevBackspacesCount + backspacesCount || 0,
					errorsCount: prevErrorsCount + errorsCount || 0,
					keystrokesCount: prevKeystrokesCount + keystrokesCount || 0,
					count: prevCount + 1,
					date,
				};
				uniqueDayDetails[date] = updatedDayDetails;
			} else {
				uniqueDayDetails[date] = {
					accuracy,
					backspacesCount,
					errorsCount,
					keystrokesCount,
					count: 1,
					date,
				};
			}
		}
	});

	const averageReportDetails = [];

	Object.entries(uniqueDayDetails).forEach(([date, details]) => {
		const { count, accuracy, backspacesCount, errorsCount, keystrokesCount } =
			details || {};

		if (count) {
			averageReportDetails.push({
				date,
				accuracy: accuracy / count,
				backspacesCount: Math.floor(backspacesCount / count),
				errorsCount: Math.floor(errorsCount / count),
				keystrokesCount: Math.floor(keystrokesCount / count),
			});
		}
	});
	return averageReportDetails;
};

export const getParsedPassagesDetails = (passages) => {
	if (!passages?.length) {
		return [];
	}
	return passages?.map?.((passageDetails) => {
		return {
			passageId: passageDetails?.id,
			passageText: passageDetails?.passage_text,
			passageTitle: passageDetails?.passage_title,
		};
	});
};

export const getParsedLessonsList = (lessons) => {
	if (!lessons?.length) {
		return [];
	}
	return lessons?.map?.((lessonDetails) => {
		return {
			id: lessonDetails?.id,
			title: lessonDetails?.title,
			text: lessonDetails?.lesson_text,
			// TODO: to remove post testing
			isRestricted: lessonDetails?.isRestricted,
			// isRestricted: false,
		};
	});
};

export const getParsedLessonResultList = (results) => {
	if (!results.length) {
		return [];
	}
	return results?.map?.((resultDetails) => {
		return {
			id: resultDetails?.lesson_id,
			accuracy: resultDetails?.accuracy,
			// TODO: to remove post testing
			isCompleted: resultDetails?.accuracy >= THRSHOLD_ACCURACY_FOR_LESSON,
			// isCompleted: true,
		};
	});
};
