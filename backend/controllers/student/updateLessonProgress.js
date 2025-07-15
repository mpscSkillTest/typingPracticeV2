import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getUserIdFromToken } from "../../utils/utils.js";
import { LESSON_RESULT_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

const calculateAccuracy = (passageText, inputText) => {
	const expectedWords = passageText?.trim()?.split(" ")?.filter(Boolean);
	const typedWords = inputText?.trim()?.split(" ")?.filter(Boolean);

	// Error handling
	if (typedWords.length === 0) {
		return 0;
	}

	let correctCount = 0;

	// Compare only up to expectedWords.length
	for (let i = 0; i < expectedWords.length; i++) {
		if (
			(typedWords[i] || "").toLowerCase() === expectedWords[i].toLowerCase()
		) {
			correctCount++;
		}
	}

	const accuracy = (correctCount / expectedWords.length) * 100;

	return parseFloat(accuracy.toFixed(2));
};

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

		logger.info(
			`submitting lesson results for user ${userId} subject ${subject} Everything is OK`
		);

		const accuracy = calculateAccuracy(passageText, inputText);

		const { data: selectData } = await supabase
			.from(LESSON_RESULT_DB_NAME)
			.select(
				`
				id,
				accuracy
			`
			)
			.eq("lesson_id", lessonId)
			.eq("user_id", userId)
			.limit(1);

		const previousAccuracy = selectData?.[0]?.accuracy || 0;
		const progressId = selectData?.[0]?.id;

		// if no previous progress present or if new progress is better than previous
		const shouldUpdateProgress = !progressId || previousAccuracy <= accuracy;

		if (shouldUpdateProgress) {
			const { error } = await supabase
				.from(LESSON_RESULT_DB_NAME)
				.upsert({
					lesson_id: lessonId,
					user_id: userId,
					accuracy: accuracy || 0,
					answer_text: inputText,
					subject,
					duration,
					id: progressId,
				})
				.select();

			if (error) {
				logger.error(error);
				res
					.status(StatusCodes.BAD_REQUEST)
					.send({ progress: accuracy, error: error?.message });
				return;
			}
		}

		res.status(StatusCodes.OK).send({
			progress: accuracy,
			error: null,
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
