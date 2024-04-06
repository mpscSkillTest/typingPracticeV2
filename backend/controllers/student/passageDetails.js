import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { PASSAGE_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

export const getPassages = async (req, res) => {
  const { subject, mode } = req.body || {};
  logger.info("Checking the getPassages status: Everything is OK");
  try {
    const { data, error } = await supabase
      .from(PASSAGE_DB_NAME)
      .select(
        `
    id,
    passage_text,
    passage_title
  `
      )
      .eq("subject", subject)
      .eq("typing_mode", mode)
      .order("created_at", { ascending: true })
      .limit(5);

    if (error) {
      logger.error(
        "Checking the getPassages status: Encountered error in passage details retrieval"
      );
      throw new Error(error);
    }

    const parsedPassages = data?.map?.((passageDetails) => {
      return {
        passageId: passageDetails?.id,
        passageText: passageDetails?.passage_text,
        passageTitle: passageDetails.passage_title,
      };
    });
    logger.info("Checking the getPassages status: Fetched passage details");
    res.status(StatusCodes.OK).send({
      passages: parsedPassages || [],
      error: null,
    });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ passages: [], error: "No passages available" });
    return;
  }
};
