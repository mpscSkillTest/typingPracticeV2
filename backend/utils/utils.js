export const getAccessTokenFromHeaders = (req) => {
  let accessToken = req?.headers?.authorization || "";
  if (accessToken) {
    accessToken = accessToken.split("Bearer ").pop();
  }
  return accessToken;
};
