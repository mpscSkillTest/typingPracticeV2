import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getAccessTokenFromHeaders } from "../../utils/utils.js";
import { RESULTS_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

export const getStudentRecentResults = async (req, res) => {
  logger.info("Fetching the recent student results status: Everything is OK");
  const accessToken = getAccessTokenFromHeaders(req);

  const { subject, mode } = req.body || {};

  try {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      logger.error(
        `Fetching the recent student results status: no user associated with access_token: ${accessToken}`
      );
      throw new Error(error);
    }
    const userId = data?.user?.id;

    logger.info(`Fetched User Id:${userId} Everything is OK`);

    if (!userId) {
      logger.error(`Fetched User Id:${userId} user not found`);
      throw new Error("User not found. Please try again");
    }

    logger.info(
      `Recent Results for user ${userId} mode:${mode} subject ${subject} Everything is OK`
    );

    const { data: resultsData, error: resultsError } = await supabase
      .from(RESULTS_DB_NAME)
      .select(
        `
      created_at,
      keystorkes_count,
      errors_count,
      backspaces_count,
      total_words_count,
      typed_words_count,
      accuracy,
      duration,
      passage_id,
      passages ( passage_title )
    `
      )
      .eq("user_id", userId)
      .eq("subject", subject)
      .eq("type", mode)
      .order("created_at", { ascending: false })
      .limit(10);
    if (resultsError) {
      logger.error("Fetching Recent Results for user Failed");
      throw new Error(resultsError);
    }

    const recentResults =
      resultsData
        ?.map?.((result) => {
          const {
            accuracy,
            backspaces_count,
            created_at,
            duration,
            errors_count,
            keystorkes_count,
            passage_id,
            total_words_count,
            typed_words_count,
            id,
            passages,
          } = result || {};
          return {
            accuracy,
            backspacesCount: backspaces_count,
            date: created_at,
            duration,
            errorsCount: errors_count,
            keystrokesCount: keystorkes_count,
            mode,
            passageId: passage_id,
            subject,
            totalWordsCount: total_words_count,
            typedWordsCount: typed_words_count,
            resultId: id,
            passageTitle: passages.passage_title,
          };
        })
        ?.reverse?.() || [];

    res.status(StatusCodes.OK).send({
      results: recentResults,
      error: null,
    });
    return;
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(StatusCodes.BAD_REQUEST).send({
      results: [],
      error: "Fetching Results Failed",
    });
    return;
  }
};
