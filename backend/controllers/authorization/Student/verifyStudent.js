import { supabase } from "../../../dbClient.js";

export const verifyStudent = async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send({ message: "Authorization token missing" });
  }
  let accessToken = `${req.headers.authorization}`;
  accessToken = accessToken.split("Bearer ").pop();

  try {
    const response = await supabase.auth.getUser(accessToken);
    console.log({ response });
    if (response.data.user) {
      console.log({ user: response.data.user });
      res.status(200).send({ user: response.data.user.user_metadata });
    }
    throw new Error(error);
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Session Expired" });
  }
};
