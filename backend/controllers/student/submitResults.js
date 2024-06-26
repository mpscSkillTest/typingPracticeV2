import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getUserResults } from "../../utils/getPassageUtils.js";
import { getUserIdFromToken } from "../../utils/utils.js";
import { shouldHaveLimitedAccess } from "../../utils/subscriptionUtils.js";
import { RESULTS_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

export const submitResults = async (req, res) => {
  const userId = await getUserIdFromToken(req);

  try {
    if (!userId) {
      logger.error(`submit results for User Id:${userId} user not found`);
      throw new Error("User not found. Please try again");
    }

    const {
      inputText,
      passageText,
      subject,
      mode,
      backspacesCount,
      keystrokesCount,
      duration,
      passageId,
      validUserInput,
    } = req.body || {};
    const expectedWords = passageText.trim().split(" ").filter(Boolean);
    const typedWords = inputText.trim().split(" ").filter(Boolean);
    // words typed till 1500 keystrokes
    const validTypedWords = validUserInput.trim().split(" ").filter(Boolean);

    logger.info(
      `submitting results for user ${userId} mode:${mode} subject ${subject} Everything is OK`
    );

    const result = getUserResults({
      expectedWords,
      typedWords,
    });

    const resultAsPerMPSC = getUserResults({
      expectedWords,
      typedWords: validTypedWords,
    });
    if (!result || !resultAsPerMPSC) {
      res.status(StatusCodes.BAD_REQUEST).send({
        result: null,
        resultAsPerMPSC: null,
        error: "Incorrect Input",
      });
      return;
    }

    const { totalErrorCount, accuracy } = result;
    const {
      totalErrorCount: totalErrorCountForMPSC,
      accuracy: accuracyForMPSC,
    } = resultAsPerMPSC;

    const { data: recentResults } = await supabase
      .from(RESULTS_DB_NAME)
      .select(`id`, { count: "exact" })
      .eq("user_id", userId)
      .eq("subject", subject)
      .eq("type", mode);

    const isAccessLimited = await shouldHaveLimitedAccess(userId, subject);
    let resultsLimit = 10;
    if (mode === "MOCK") {
      resultsLimit = 3;
    }
    /**
     * For Free users we wont retain data beyond 10 tests in db for each subject for each mode
     */
    const shouldSaveResultInDb =
      !isAccessLimited || recentResults?.length < resultsLimit;

    if (shouldSaveResultInDb) {
      const { error } = await supabase.from(RESULTS_DB_NAME).insert({
        user_id: userId,
        subject,
        keystorkes_count: keystrokesCount,
        errors_count: totalErrorCount,
        backspaces_count: backspacesCount,
        total_words_count: expectedWords?.length || 0,
        typed_words_count: typedWords?.length || 0,
        type: mode,
        accuracy: accuracy || 0,
        duration,
        passage_id: passageId,
        input_text: inputText,
        mpsc_errors_count: totalErrorCountForMPSC,
        mpsc_accuracy: accuracyForMPSC,
        mpsc_input_text: validUserInput,
      });

      if (error) {
        logger.error(error);
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ result: null, resultAsPerMPSC: null, error: error?.message });
        return;
      }

      res.status(StatusCodes.OK).send({
        result,
        resultAsPerMPSC,
        accessLimitReached: !shouldSaveResultInDb,
      });
    }
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ result: null, resultAsPerMPSC: null, error: error?.message });
    return;
  }
  return;
};
