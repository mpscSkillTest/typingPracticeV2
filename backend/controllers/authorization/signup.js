import { supabase } from "../../dbClient.js";
import UserTypeEnum from "../../enums/UserTypeEnum.js";

export const signup = async (req, res) => {
  const { emailId, password, contactNumber, userName: name } = req.body || {};

  try {
    const { data, error } = await supabase.auth.signUp({
      email: emailId,
      password: password,
      options: {
        data: {
          emailId,
          name,
          contactNumber,
          type: UserTypeEnum.STUDENT.name,
        },
      },
    });
    if (data?.user) {
      res.status(200).send({ user: data.user.id });
    } else {
      throw new Error(error);
    }
  } catch (error) {
    const { status = "Something Broke", statusCode = 500 } = error || {};
    res.status(statusCode).send({ msg: status, error });
  }
};
