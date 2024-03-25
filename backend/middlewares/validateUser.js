import { supabase } from "../dbClient.js";
import { StatusCodes } from "http-status-codes";

export function validateUser() {
  return async (req, res, next) => {
    try {
      let accessToken = req.headers.authorization;
      if (!accessToken) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ user: null, error: "User not found" });
        return;
      }
      const { data } = await supabase.auth.getUser(accessToken);
      const { user } = data || {};
      if (!user) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ user: null, error: "User not found" });
        return;
      }
      next();
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  };
}
