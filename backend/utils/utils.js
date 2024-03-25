export const getAccessTokenFromHeaders = (req) => {
  return req?.headers?.authorization || "";
};
