import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { LESSONS_DB_NAME } from "../../constant.js";
import { shouldHaveLimitedAccess } from "../../utils/subscriptionUtils.js";
import {
	getAccessTokenFromHeaders,
	getParsedLessonsList,
} from "../../utils/utils.js";
import logger from "../../utils/logger.js";

export const getLessonDetails = async (req, res) => {
	const { subject, id } = req.body || {};
	const accessToken = getAccessTokenFromHeaders(req);
	logger.info("Checking the lesson details status: Everything is OK");
	try {
		const { data: userData, error: userError } =
			await supabase.auth.getUser(accessToken);
		const userId = userData?.user?.id;

		if (userError || !userId) {
			logger.error(
				`Fetching the lesson details status: no user associated with access_token: ${accessToken}`
			);
			throw new Error(userError?.message);
		}

		const shouldShowLimitedResults = await shouldHaveLimitedAccess(
			userId,
			subject
		);

		const { data, error } = await supabase
			.from(LESSONS_DB_NAME)
			.select(
				`
        id,
        title,
        lesson_text,
        isRestricted
`
			)
			.eq("subject", subject)
			.eq("id", id);

		const parsedLessonDetails = getParsedLessonsList(data)?.[0];

		if (shouldShowLimitedResults && parsedLessonDetails?.isRestricted) {
			logger.error("Checking the lesson details status: Limit exhausted");
			res.status(StatusCodes.OK).send({
				lesson: null,
				error: "Access to this lesson is restricted",
			});
			return;
		}

		if (error) {
			logger.error(
				"Checking the getLessonDetails status: Encountered error in lesson details retrieval"
			);
			throw new Error(error?.message);
		}

		logger.info(
			"Checking the getLessonDetails status: Fetched lessons details"
		);
		res.status(StatusCodes.OK).send({
			lesson: parsedLessonDetails,
			error: null,
		});
		return;
	} catch (error) {
		logger.error(error);
		res.status(StatusCodes.BAD_REQUEST).send({ lesson: null, error });
		return;
	}
};
