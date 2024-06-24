import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getUserIdFromToken } from "../../utils/utils.js";
import { FEEDBACK_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

export const submitUserFeedback = async (req, res) => {
  const userId = await getUserIdFromToken(req);
  try {
    if (!userId) {
      logger.error(`submit feedback for User Id:${userId} user not found`);
      throw new Error("User not found. Please try again");
    }
    const { title, feedback } = req.body || {};

    logger.info(
      `submitting feedback for user ${userId} title:${title} feedback ${feedback} Everything is OK`
    );
    const { error } = await supabase.from(FEEDBACK_DB_NAME).insert({
      user_id: userId,
      title,
      query: feedback,
    });
    if (error) {
      logger.error(`Error While submitting feedback for user ${userId}`);
      logger.error(error?.message);
      throw new Error(error.message);
    }
    res.status(StatusCodes.OK).send({
      feedbackSubmitted: true,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ feedbackSubmitted: false, error: error?.message });
    return;
  }
  return;
};
