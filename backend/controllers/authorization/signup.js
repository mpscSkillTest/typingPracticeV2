import { supabase } from "../../dbClient.js";
import UserTypeEnum from "../../enums/UserTypeEnum.js";

export const signup = async (req, res) => {
  const {
    emailId,
    password,
    selectedCourses,
    contactNumber,
    userName: name,
    gender,
    city,
  } = req.body || {};

  const { english, marathi } = selectedCourses || {};

  try {
    const { data, error } = await supabase.auth.signUp({
      email: emailId,
      password: password,
      options: {
        data: {
          emailId,
          city,
          gender,
          name,
          contactNumber,
          type: UserTypeEnum.STUDENT.name,
          selectedCourses: {
            english: Number(english) || null,
            marathi: Number(marathi) || null,
          },
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
