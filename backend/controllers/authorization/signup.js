import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import logger from "../../utils/logger.js";
import UserTypeEnum from "../../enums/UserTypeEnum.js";

export const signup = async (req, res) => {
  const { emailId, password, contactNumber, userName: name } = req.body || {};

  logger.info(
    "signing up for new user with following data",
    JSON.stringify(req?.body || {})
  );

  try {
    const { data, error } = await supabase.auth.signUp({
      email: emailId,
      password: password,
      options: {
        data: {
          email: emailId,
          name,
          contactNumber: parseInt(contactNumber),
          type: UserTypeEnum.STUDENT.name,
        },
      },
    });
    if (data?.user) {
      logger.error(`sign up process successful for ${emailId}`);
      res.status(StatusCodes.OK).send({ user: data.user.id });
      return;
    } else {
      throw new Error(error);
    }
  } catch (error) {
    logger.error(`sign up process failed for ${emailId}`);
    logger.error(`stack trace up process failed for ${error?.stack}`);
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ user: null, error: "something broke" });
  }
  return;
};
