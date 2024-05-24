import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getUserIdFromToken, getDailyAvg } from "../../utils/utils.js";
import { RESULTS_DB_NAME } from "../../constant.js";
import { shouldHaveLimitedAccess } from "../../utils/subscriptionUtils.js";
import logger from "../../utils/logger.js";

export const getStudentResultReport = async (req, res) => {
  logger.info("Fetching the student reports status: Everything is OK");
  const { subject, mode, duration } = req.body || {};

  const { from, to } = duration || {};

  try {
    const userId = await getUserIdFromToken(req);

    if (!userId) {
      logger.error(`Fetched reports for User Id:${userId} user not found`);
      throw new Error("User not found. Please try again");
    }

    logger.info(
      `Reports for user ${userId} mode:${mode} subject ${subject} duration:from-${from} till ${to} Everything is OK`
    );

    const isHavingLimitedAccess = await shouldHaveLimitedAccess(
      userId,
      subject
    );

    /**
     * From and to are not equal for week, 15 days and month duration
     * free users will have access to today and yesterday duration
     */
    if (isHavingLimitedAccess && from !== to) {
      res.status(StatusCodes.OK).send({
        results: [],
        error: null,
        accessLimitReached: true,
      });
      return;
    }

    const formattedFrom = dayjs(from).startOf("day").format();
    const formattedTo = dayjs(to).endOf("day").format();

    const { data: resultsData, error: resultsError } = await supabase
      .from(RESULTS_DB_NAME)
      .select(
        `
      created_at,
      keystorkes_count,
      errors_count,
      backspaces_count,
      accuracy,
      mpsc_accuracy,
      mpsc_errors_count,
      id
    `
      )
      .eq("user_id", userId)
      .eq("subject", subject)
      .eq("type", mode)
      .gte("created_at", formattedFrom)
      .lte("created_at", formattedTo)
      .order("created_at", { ascending: true });

    if (resultsError) {
      logger.error("Fetching reports for user Failed");
      throw new Error(resultsError?.message);
    }

    const reportData = resultsData?.map?.((result) => {
      const {
        accuracy,
        backspaces_count,
        created_at,
        errors_count,
        keystorkes_count,
        mpsc_accuracy,
        mpsc_errors_count,
        id,
      } = result || {};
      return {
        accuracy: accuracy || 0,
        backspacesCount: backspaces_count || 0,
        date: dayjs(created_at).format("YYYY-MM-DD"),
        errorsCount: errors_count || 0,
        keystrokesCount: keystorkes_count || 0,
        resultId: id,
        mpscAccuracy: mpsc_accuracy || 0,
        mpscErrorsCount: mpsc_errors_count || 0,
      };
    });

    // for today and yesterday duration to and from will be same
    // so we will return all test results given on those days
    if (to === from) {
      res.status(StatusCodes.OK).send({
        results: reportData,
        error: null,
      });
      return;
    }

    // for larger duration such as week, fortnight and month we will return daily basis avg
    const updatedAvgResultData = getDailyAvg(reportData);

    res.status(StatusCodes.OK).send({
      results: updatedAvgResultData,
      error: null,
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.BAD_REQUEST).send({
      results: [],
      error: "Fetching Results Failed",
    });
    return;
  }
};
