import { validateUserToken } from "../utils/token.js";
export const authenticationMiddleware = async (req, res, next) => {
  const authHeaders = req.headers["authorization"];

  if (!authHeaders) {
    return next();
  }
  if (!authHeaders.startsWith("Bearer")) {
    return res.status(400).json({ error: "Token must start with Bearer" });
  }

  const [_,token] = authHeaders.split(' ')
  const payload = validateUserToken(token)
  req.user = payload
  next()
};
