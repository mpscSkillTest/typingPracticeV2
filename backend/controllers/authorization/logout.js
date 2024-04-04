import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getAccessTokenFromHeaders } from "../../utils/utils.js";

export const logout = async (req, res) => {
  let accessToken = getAccessTokenFromHeaders(req);
  if (accessToken) {
    await supabase.auth.admin.signOut(accessToken, "global");
  }
  res.status(StatusCodes.OK).send({ message: "User logged out successfully" });
  return;
};
