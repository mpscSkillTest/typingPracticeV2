import { supabase } from "../../../dbClient.js";

export const verifyStudent = async (req, res) => {
  let accessToken = req.headers.authorization;
  if (!accessToken) {
    res.status(401).send({ user: null, error: "Authorization token missing" });
    return;
  }
  accessToken = accessToken.split("Bearer ").pop();
  const { data } = await supabase.auth.getUser(accessToken);
  const { user } = data || {};

  if (user) {
    res.status(200).send({ user: data.user.user_metadata, error: null });
  } else {
    res.status(401).send({ user: null, error: "Session Expired" });
  }
};
