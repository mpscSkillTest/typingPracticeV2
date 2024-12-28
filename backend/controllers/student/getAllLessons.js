import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { LESSONS_DB_NAME } from "../../constant.js";
import { shouldHaveLimitedAccess } from "../../utils/subscriptionUtils.js";
import {
  getAccessTokenFromHeaders,
  getParsedLessonsList,
} from "../../utils/utils.js";
import logger from "../../utils/logger.js";

export const getAllLessons = async (req, res) => {
  const { subject } = req.body || {};
  const accessToken = getAccessTokenFromHeaders(req);
  logger.info("Checking the getAllLessons status: Everything is OK");
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    const userId = userData?.user?.id;

    if (userError || !userId) {
      logger.error(
        `Fetching the lessons list status: no user associated with access_token: ${accessToken}`
      );
      throw new Error(userError?.message);
    }

    const shouldShowLimitedResults = await shouldHaveLimitedAccess(
      userId,
      subject
    );
    const limit = shouldShowLimitedResults ? 5 : null;

    const { data, error } = await supabase
      .from(LESSONS_DB_NAME)
      .select(
        `
        id,
        title,
        lesson_text
`
      )
      .eq("subject", subject)
      .order("id", { ascending: true })
      .limit(limit);

    if (error) {
      logger.error(
        "Checking the getAllLessons status: Encountered error in lessons list retrieval"
      );
      throw new Error(error?.message);
    }

    logger.info("Checking the getAllLessons status: Fetched lessons details");
    res.status(StatusCodes.OK).send({
      lessons: getParsedLessonsList(data),
      error: null,
    });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ lessons: [], error: "No lessons available" });
    return;
  }
};
