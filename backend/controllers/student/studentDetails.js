import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import logger from "../../utils/logger.js";
import { PROFILE_DB_NAME } from "../../constant.js";
import { getAccessTokenFromHeaders } from "../../utils/utils.js";

export const getStudentDetails = async (req, res) => {
  const accessToken = getAccessTokenFromHeaders(req);
  try {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      throw new Error(error);
    }
    const userId = data?.user?.id;

    if (!userId) {
      throw new Error("User not found. Please try again");
    }

    const { data: profileData, error: profileError } = await supabase
      .from(PROFILE_DB_NAME)
      .select(
        `
      name,
      user_type
    `
      )
      .eq("user_id", userId);

    if (profileError) {
      throw new Error(profileError);
    }

    const { name, user_type: type } = profileData?.[0] || {};

    if (!name || !type) {
      throw new Error("missing key details");
    }

    res.status(StatusCodes.OK).send({
      user: {
        name,
        userId,
        type,
      },
      error: null,
    });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ user: null, error: "User not found. Please try again" });
    return;
  }
};