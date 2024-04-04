import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import logger from "../../utils/logger.js";

export const getPassages = async (req, res) => {
  const { subject, mode } = req.body || {};
  logger.info("Checking the getPassages status: Everything is OK");
  try {
    const { data, error } = await supabase
      .from("passages")
      .select(
        `
    id,
    passage_text
  `
      )
      .eq("subject", subject)
      .eq("typing_mode", mode);

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
