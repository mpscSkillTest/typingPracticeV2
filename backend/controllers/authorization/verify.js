import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";

export const verify = async (req, res) => {
  const { accessToken, type } = req.body || {};

  try {
    if (!accessToken) {
      throw new Error("Access token missing");
    }

    /**
     * Handling for access token set in cookie of browser
     */
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      throw new Error("Access token expired. Please sign up again");
    }

    const { user } = data || {};
    const { id } = user || {};

    if (!id) {
      throw new Error("No user found");
    }

    let responseData = {
      isVerified: true,
      error: null,
    };

    /**
     * Handling confirmation link change to redirect user to dashboard
     */
    if (type === "signup") {
      responseData = {
        ...responseData,
        token: accessToken,
      };
    }
    res.status(StatusCodes.OK).send(responseData);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({
      error: error?.message,
      isVerified: false,
      token: null,
    });
  }
};
