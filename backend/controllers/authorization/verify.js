import { supabase } from "../../dbClient.js";
import { getAccessTokenFromHeaders } from "../../utils/utils.js";

export const verify = async (req, res) => {
  const accessToken = getAccessTokenFromHeaders(req);
  if (!accessToken) {
    res.status(401).send({ user: null, error: "Authorization token missing" });
    return;
  }
  const { data } = await supabase.auth.getUser(accessToken);
  const { user } = data || {};

  if (user) {
    res.status(200).send({ user: user?.user_metadata, error: null });
  } else {
    res.status(401).send({ user: null, error: "Session Expired" });
  }
};
