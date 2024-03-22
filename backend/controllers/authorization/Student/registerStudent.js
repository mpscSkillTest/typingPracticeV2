import { supabase } from "../../../dbClient.js";

export const registerStudent = async (req, res) => {
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
  const selectedEnglishCourse = Number(english) || null;
  const selectedMarathiCourse = Number(marathi) || null;

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
          selectedEnglishCourse,
          selectedMarathiCourse,
        },
      },
    });
    if (data.user) {
      res.status(200).send({ user: data.user.id });
    } else {
      throw new Error(error);
    }
  } catch (error) {
    const { status = "Something Broke", statusCode = 500 } = error || {};
    res.status(statusCode).send({ msg: status, error });
  }
};
