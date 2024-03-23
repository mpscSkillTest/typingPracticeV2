import { supabase } from "../../dbClient.js";
import { getAccessTokenFromHeaders } from "../../utils/utils.js";

export const logout = async (req, res) => {
  let accessToken = getAccessTokenFromHeaders(req);
  if (accessToken) {
    await supabase.auth.signOut(accessToken);
  }
  res.status(200).send({ message: "User logged out successfully" });
};
