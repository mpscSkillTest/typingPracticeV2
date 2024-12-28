import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { LESSON_RESULT_DB_NAME } from "../../constant.js";
import {
  getAccessTokenFromHeaders,
  getParsedLessonResultList,
} from "../../utils/utils.js";
import logger from "../../utils/logger.js";

export const getStudentProgress = async (req, res) => {
  const { subject } = req.body || {};
  const accessToken = getAccessTokenFromHeaders(req);
  logger.info("Checking the getStudentProgress status: Everything is OK");
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    const userId = userData?.user?.id;

    if (userError || !userId) {
      logger.error(
        `Fetching the student progress status: no user associated with access_token: ${accessToken}`
      );
      throw new Error(userError?.message);
    }

    const { data, error } = await supabase
      .from(LESSON_RESULT_DB_NAME)
      .select(
        `
        lesson_id,
        accuracy
`
      )
      .eq("subject", subject)
      .eq("user_id",userId)

    if (error) {
      logger.error(
        "Checking the getStudentProgress status: Encountered error in student progress retrieval"
      );
      throw new Error(error?.message);
    }

    logger.info("Checking the getStudentProgress status: Fetched student progress details");
    res.status(StatusCodes.OK).send({
      progress: getParsedLessonResultList(data),
      error: null,
    });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ progress: [], error: "No student progress available" });
    return;
  }
};
