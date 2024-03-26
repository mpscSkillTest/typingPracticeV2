import { StatusCodes } from "http-status-codes";
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
          email: emailId,
          name,
          contactNumber,
          type: UserTypeEnum.STUDENT.name,
        },
      },
    });
    if (data?.user) {
      res.status(StatusCodes.OK).send({ user: data.user.id });
    } else {
      throw new Error(error);
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ user: null, error: "something broke" });
  }
};
