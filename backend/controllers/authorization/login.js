import { supabase } from "../../dbClient.js";

export const login = async (req, res) => {
  const { emailId, password } = req.body || {};
  const { data } = await supabase.auth.signInWithPassword({
    email: emailId,
    password: password,
  });

  if (data?.user?.user_metadata && data?.session?.access_token) {
    res.status(200).send({
      user: data?.user?.user_metadata,
      accessToken: data?.session?.access_token,
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
