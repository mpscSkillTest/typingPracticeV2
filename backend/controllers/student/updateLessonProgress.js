import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getUserResults } from "../../utils/getPassageUtils.js";
import { getUserIdFromToken } from "../../utils/utils.js";
import { shouldHaveLimitedAccess } from "../../utils/subscriptionUtils.js";
import { LESSON_RESULT_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

export const updateLessonProgress = async (req, res) => {
	const userId = await getUserIdFromToken(req);

	try {
		if (!userId) {
			logger.error(
				`update lesson progress for User Id:${userId} user not found`
			);
			throw new Error("User not found. Please try again");
		}

		const {
			inputText,
			passageText,
			subject,
			duration,
			id: lessonId,
		} = req.body || {};

		const expectedWords = passageText.trim().split(" ").filter(Boolean);
		const typedWords = inputText.trim().split(" ").filter(Boolean);

		logger.info(
			`submitting lesson results for user ${userId} subject ${subject} Everything is OK`
		);

		const progress = getUserResults({
			expectedWords,
			typedWords,
		});

		if (!progress) {
			res.status(StatusCodes.BAD_REQUEST).send({
				progress: null,
				error: "Incorrect Input",
			});
			return;
		}

		const { accuracy } = progress || {};

		const isAccessLimited = await shouldHaveLimitedAccess(userId, subject);

		if (isAccessLimited) {
			const { error } = await supabase.from(LESSON_RESULT_DB_NAME).insert({
				lesson_id: lessonId,
				user_id: userId,
				accuracy: accuracy || 0,
				answer_text: inputText,
				subject,
				duration,
			});

			if (error) {
				logger.error(error);
				res
					.status(StatusCodes.BAD_REQUEST)
					.send({ progress: null, error: error?.message });
				return;
			}

			res.status(StatusCodes.OK).send({
				progress,
				accessLimitReached: isAccessLimited,
			});
			return;
		}
		res.status(StatusCodes.BAD_REQUEST).send({
			progress: null,
			error: "Unable to save progress due to restricted access",
		});
		return;
	} catch (error) {
		logger.error(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.send({ progress: null, error: error?.message });
		return;
	}
};
