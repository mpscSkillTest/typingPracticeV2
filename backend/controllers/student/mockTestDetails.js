import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { PASSAGE_DB_NAME, RESULTS_DB_NAME } from "../../constant.js";
import { shouldHaveLimitedAccess } from "../../utils/subscriptionUtils.js";
import {
  getAccessTokenFromHeaders,
  getParsedPassagesDetails,
} from "../../utils/utils.js";
import logger from "../../utils/logger.js";

export const getMockTestDetails = async (req, res) => {
  const { subject } = req.body || {};
  const accessToken = getAccessTokenFromHeaders(req);
  logger.info("Checking the get mock test details status: Everything is OK");
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken
    );
    const userId = userData?.user?.id;

    if (userError || !userId) {
      logger.error(
        `Fetching the mock test details status: no user associated with access_token: ${accessToken}`
      );
      throw new Error(userError?.message);
    }

    const shouldShowLimitedResults = await shouldHaveLimitedAccess(
      userId,
      subject
    );

    const { data: mockTestsData, error: mockTestsError } = await supabase
      .from(RESULTS_DB_NAME)
      .select(
        `
      id,
      passage_id
`
      )
      .eq("user_id", userId)
      .eq("subject", subject)
      .eq("type", "MOCK");

    if (mockTestsError) {
      logger.error(
        `Fetching previous mock tests data for user ${userId} Failed`
      );
      throw new Error(mockTestsError?.message);
    }

    if (shouldShowLimitedResults && mockTestsData?.length >= 3) {
      res.status(StatusCodes.OK).send({
        passageDetails: null,
        accessLimitReached: true,
        error: null,
      });
    }

    const { data: practicePassagesData, error: practicePassagesError } =
      await supabase
        .from(PASSAGE_DB_NAME)
        .select(
          `
        id,
        passage_text
        
`
        )
        .eq("subject", subject)
        .eq("typing_mode", "PRACTICE");

    if (practicePassagesError) {
      logger.error(
        `Fetching practice passages for mock tests for user ${userId} Failed`
      );
      throw new Error(practicePassagesError?.message);
    }

    const { data: testPassagesData, error: testPassagesError } = await supabase
      .from(PASSAGE_DB_NAME)
      .select(
        `
          id,
          passage_text
          
  `
      )
      .eq("subject", subject)
      .eq("typing_mode", "MOCK");

    if (testPassagesError) {
      logger.error(
        `Fetching test passages for mock tests for user ${userId} Failed`
      );
      throw new Error(testPassagesError?.message);
    }

    const attemptedPassagesId = new Set();

    const practicePassages = getParsedPassagesDetails(practicePassagesData);

    const testPassages = getParsedPassagesDetails(testPassagesData);

    testPassages.forEach((passage) => {
      attemptedPassagesId.add(passage?.passageId);
    });

    let filteredPassages = testPassages.filter(
      (passage) => !attemptedPassagesId.has(passage?.passageId)
    );

    if (!filteredPassages?.length) {
      filteredPassages = testPassages;
    }

    const keyboardTestPassageDetails =
      practicePassages[Math.floor(Math.random() * practicePassages.length)];

    const practicePassageDetails =
      practicePassages[Math.floor(Math.random() * practicePassages.length)];

    const testPassageDetails =
      filteredPassages[Math.floor(Math.random() * filteredPassages.length)];

    res.status(StatusCodes.OK).send({
      passageDetails: {
        keyboardTestPassageDetails,
        practicePassageDetails,
        testPassageDetails,
      },
      accessLimitReached: false,
      error: null,
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.BAD_REQUEST).send({
      passageDetails: null,
      accessLimitReached: false,
      error: "No passages available",
    });
    return;
  }
};
