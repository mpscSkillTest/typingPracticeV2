import { supabase } from "../dbClient.js";
import logger from "../utils/logger.js";

export const getAccessTokenFromHeaders = (req) => {
  return req?.headers?.authorization || "";
};

export const getUserIdFromToken = async (req) => {
  const accessToken = getAccessTokenFromHeaders(req);
  logger.info(
    `accessing getUserIdFromToken method for accessToke:=> ${accessToken}`
  );
  if (!accessToken) {
    logger.error(`missing access token in getUserIdFromToken method`);
    return null;
  }

  /**
   * Handling for access token set in cookie of browser
   */
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user?.id) {
    logger.error(`getUserIdFromToken method user failed due ${error.message}`);
    logger.error(`verify user failed stack ${error.stack}`);
    logger.error(`no user found for access token: ${accessToken}`);
    return null;
  }

  logger.info(`user found with user id:=> ${data?.user?.id}`);

  return data?.user?.id;
};
