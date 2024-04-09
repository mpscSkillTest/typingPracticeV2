import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import logger from "../../utils/logger.js";

export const forgotPassword = async (req, res) => {
  const { emailId } = req.body || {};
  const { data, error } = await supabase.auth.resetPasswordForEmail(emailId);

  logger.info(`sending reset password for user:${emailId}`);

  if (data) {
    logger.info(`successfully sent reset password link for user:${emailId}`);
    res.status(StatusCodes.OK).send({ msg: "Reset Password Link Sent" });
    return;
  }

  if (error) {
    logger.info(`sending password reset link failed for user: ${emailId}`);
    logger.error(error?.message);
    logger.error(error?.stack);
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: error?.message || "Reset Password Link Sent" });
    return;
  }
};

export const resetPassword = async (req, res) => {
  const { accessToken } = req.body || {};

  logger.info(`reset password for accessToke:=> ${accessToken}`);

  try {
    if (!accessToken) {
      logger.error(`reset password failed due to missing token`);
      throw new Error("Access token missing");
    }

    const { data, error } = await supabase.auth.admin.updateUserById({
      password: "new password",
    });
    if (error) {
      logger.error(`verify user failed due ${error.message}`);
      logger.error(`verify user failed stack ${error.stack}`);

      throw new Error("Access token expired. Please sign up again");
    }

    const { user } = data || {};
    const { id } = user || {};

    if (!id) {
      logger.error(`no user found for access token: ${accessToken}`);
      throw new Error("No user found");
    }

    /**
     * Handling confirmation link change to redirect user to dashboard
     */
    responseData = {
      error: null,
      token: accessToken,
    };
    res.status(StatusCodes.OK).send(responseData);
  } catch (error) {
    logger.error(`verify user error: ${error}`);
    res.status(StatusCodes.UNAUTHORIZED).send({
      error: "Reset Password Failed",
    });
  }
  return;
};
