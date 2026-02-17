import jwt from "jsonwebtoken";
import { userTokenSchema } from "../validations/token.validation.js";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export const createUserToken = async (payload) => {
  const validationResult = await userTokenSchema.safeParseAsync(payload);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }
  const payloadvalidatedData = validationResult.data;
  const token = jwt.sign(payloadvalidatedData, JWT_SECRET);

  return token;
};

export const validateUserToken = async(token)=>{
    const payload = jwt.verify(token,JWT_SECRET)
    return payload
}
