import { supabase } from "../../../dbClient.js";

export const loginStudent = async (req, res) => {
  const { emailId, password } = req.body || {};
  const {
    data: { user, session },
  } = await supabase.auth.signInWithPassword({
    email: emailId,
    password: password,
  });
  if (user.user_metadata && session.access_token) {
    res
      .status(200)
      .send({
        user: user.user_metadata,
        accessToken: session.access_token,
        error: null,
      });
  } else {
    res.status(401).send({
      user: null,
      accessToken: null,
      error: "Invalid user name & password",
    });
  }
};

export const forgotPassword = async (req, res) => {
  res.status(200).send({ msg: "Forgot Password" });
};
