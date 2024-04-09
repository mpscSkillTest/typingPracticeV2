import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getAccessTokenFromHeaders } from "../../utils/utils.js";
import logger from "../../utils/logger.js";

export const logout = async (req, res) => {
  let accessToken = getAccessTokenFromHeaders(req);
  logger.info("signing out user for accessToke:=>", accessToken);
  if (accessToken) {
    await supabase.auth.admin.signOut(accessToken, "global");
  }
  logger.info("signing out successfully for accessToke:=>", accessToken);
  res.status(StatusCodes.OK).send({ message: "User logged out successfully" });
  return;
};
