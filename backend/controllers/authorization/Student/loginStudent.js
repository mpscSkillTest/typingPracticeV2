import { supabase } from "../../../dbClient.js";

export const loginStudent = async (req, res) => {
  const { emailId, password } = req.body || {};
  try {
    const {
      data: { user, session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: emailId,
      password: password,
    });
    console.log({ user, session });
    if (user.user_metadata && session.access_token) {
      res
        .status(200)
        .send({ user: user.user_metadata, accessToken: session.access_token });
    }
    throw new Error(error);
  } catch (error) {
    res.status(401).send({ error: "Invalid user name & password" });
  }
};

export const forgotPassword = async (req, res) => {
  res.status(200).send({ msg: "Forgot Password" });
};
