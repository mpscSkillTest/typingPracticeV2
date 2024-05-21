import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { PASSAGE_DB_NAME } from "../../constant.js";
import { shouldHaveLimitedAccess } from "../../utils/subscriptionUtils.js";
import {
  getAccessTokenFromHeaders,
  getParsedPassagesDetails,
} from "../../utils/utils.js";
import logger from "../../utils/logger.js";

export const getPassages = async (req, res) => {
  const { subject, mode } = req.body || {};
  const accessToken = getAccessTokenFromHeaders(req);
  logger.info("Checking the getPassages status: Everything is OK");
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    const userId = userData?.user?.id;

    if (userError || !userId) {
      logger.error(
        `Fetching the passage details status: no user associated with access_token: ${accessToken}`
      );
      throw new Error(userError?.message);
    }

    const shouldShowLimitedResults = await shouldHaveLimitedAccess(
      userId,
      subject
    );
    const limit = shouldShowLimitedResults ? 5 : null;

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
      .limit(limit);

    if (error) {
      logger.error(
        "Checking the getPassages status: Encountered error in passage details retrieval"
      );
      throw new Error(error?.message);
    }

    logger.info("Checking the getPassages status: Fetched passage details");
    res.status(StatusCodes.OK).send({
      passages: getParsedPassagesDetails(data),
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
