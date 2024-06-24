import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import logger from "../../utils/logger.js";

export const verify = async (req, res) => {
  const { accessToken, type } = req.body || {};

  logger.info(
    `verify user for accessToke:=> ${accessToken}  user-action=>${type}`
  );

  try {
    if (!accessToken) {
      logger.error(`verify user failed due to no access token`);

      throw new Error("Access token missing");
    }

    /**
     * Handling for access token set in cookie of browser
     */
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      logger.error(`verify user failed due ${error?.message}`);
      logger.error(`verify user failed stack ${error?.stack}`);

      throw new Error("Access token expired. Please sign up again");
    }

    const { user } = data || {};
    const { id } = user || {};

    if (!id) {
      logger.error(`no user found for access token: ${accessToken}`);

      throw new Error("No user found");
    }

    let responseData = {
      isVerified: true,
      error: null,
    };

    /**
     * Handling confirmation link change to redirect user to dashboard
     */
    if (type === "signup" || type === "reset-password") {
      responseData = {
        ...responseData,
        token: accessToken,
      };
    }
    res.status(StatusCodes.OK).send(responseData);
  } catch (error) {
    logger.error(`verify user error: ${error}`);
    res.status(StatusCodes.BAD_REQUEST).send({
      error: error?.message,
      isVerified: false,
      token: null,
    });
    return;
  }
  return;
};
