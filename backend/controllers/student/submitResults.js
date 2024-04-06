import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getUserResults } from "../../utils/getPassageUtils.js";
import { RESULTS_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

export const submitResults = async (req, res) => {
  const {
    inputText,
    passageText,
    subject,
    mode,
    backspacesCount,
    keystrokesCount,
    userId,
    duration,
    passageId,
  } = req.body || {};
  const expectedWords = passageText.trim().split(" ").filter(Boolean);
  const typedWords = inputText.trim().split(" ").filter(Boolean);

  const result = getUserResults({
    expectedWords,
    typedWords,
  });

  if (!result) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ result: null, error: "Incorrect Input" });
    return;
  }
  const { totalErrorCount, accuracy } = result;

  const { error } = await supabase.from(RESULTS_DB_NAME).insert({
    user_id: userId,
    subject,
    keystorkes_count: keystrokesCount,
    errors_count: totalErrorCount,
    backspaces_count: backspacesCount,
    total_words_count: expectedWords?.length || 0,
    typed_words_count: typedWords?.length || 0,
    type: mode,
    accuracy,
    duration,
    passage_id: passageId,
    input_text: inputText,
  });

  if (error) {
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ result: null, error: error.message });
    return;
  }
  res.status(StatusCodes.OK).send({ result });
  return;
};
