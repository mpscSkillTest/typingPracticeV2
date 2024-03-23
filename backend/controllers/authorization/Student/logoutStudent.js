import { supabase } from "../../../dbClient.js";

export const logoutStudent = async (req, res) => {
  let accessToken = req.headers.authorization;
  if (accessToken) {
    accessToken = accessToken.split("Bearer ").pop();
    await supabase.auth.signOut(accessToken);
  }
  res.status(200).send({ message: "User logged out successfully" });
};
