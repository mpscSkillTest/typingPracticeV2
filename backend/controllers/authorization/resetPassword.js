import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import logger from "../../utils/logger.js";

export const resetPassword = async (req, res) => {
  const { accessToken, password } = req.body || {};

  logger.info(`reset password for accessToke:=> ${accessToken}`);

  try {
    if (!accessToken) {
      logger.error(`reset password failed due to missing token`);
      throw new Error("Access token missing");
    }

    /**
     * verify user to get id
     */
    const { data: userData, error: userError } = await supabase.auth.verifyOtp({
      token_hash: accessToken,
      type: "recovery",
    });

    const updatedAccessToken = userData?.session?.access_token || "";
    const userId = userData?.user?.id || null;

    if (userError || !updatedAccessToken || !userId) {
      logger.error(`get user failed due ${userError?.message}`);
      logger.error(`get user failed stack ${userError?.stack}`);
      throw new Error("Access token expired.Password can not reset.");
    }

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      logger.error(`reset user password failed due ${error?.message}`);
      logger.error(`reset user password failed stack ${error?.stack}`);
      throw new Error("Access token expired. Please sign up again");
    }

    if (!data?.user?.id) {
      logger.error(
        `reset user id failed for access token has: ${accessToken} updated token: ${updatedAccessToken}`
      );
      throw new Error("No user found");
    }

    res.status(StatusCodes.OK).send({
      error: null,
      accessToken: updatedAccessToken,
    });
  } catch (error) {
    logger.error(`reset password user error: ${error}`);
    res.status(StatusCodes.UNAUTHORIZED).send({
      error: "Reset Password Failed",
    });
  }
  return;
};
