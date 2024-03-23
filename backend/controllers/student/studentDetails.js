import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getAccessTokenFromHeaders } from "../../utils/utils.js";

export const getStudentDetails = async (req, res) => {
  const accessToken = getAccessTokenFromHeaders(req);
  const { data } = await supabase.auth.getUser(accessToken);
  const { user } = data || {};
  if (user) {
    res.status(StatusCodes.OK).send({ user: user?.user_metadata, error: null });
  } else {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ user: null, error: "Invalid user" });
  }
};
