import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import logger from "../../utils/logger.js";

export const login = async (req, res) => {
  const { emailId, password } = req.body || {};

  logger.info(`singing in user: ${emailId}`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailId,
    password: password,
  });


  if (data?.user?.user_metadata && data?.session?.access_token) {
    logger.info(`signing in successful for user: ${emailId}`);
    res.status(200).send({
      user: data?.user?.user_metadata,
      accessToken: data?.session?.access_token,
      error: null,
    });
  } else {
    logger.error(`signing in failed for user: ${emailId}`);
    logger.error(error);
    res.status(StatusCodes.UNAUTHORIZED).send({
      user: null,
      accessToken: null,
      error: "Invalid user name & password",
    });
  }
  return;
};
