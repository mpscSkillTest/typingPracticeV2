export const verifyUser = async (req, res) => {
  console.log("verify user");
  res.status(200).send({ message: "verified" });
};

export const registerUser = async (req, res) => {
  console.log({ req });
  res.status(200).send({ msg: "Register User" });
};

export const loginUser = async (req, res) => {
  res.status(200).send({ msg: "Login User" });
};

export const forgotPassword = async (req, res) => {
  res.status(200).send({ msg: "Forgot Password" });
};
