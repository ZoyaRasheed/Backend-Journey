import { randomBytes, createHmac } from "crypto";

export const hashPasswordWithSalt = (password , userSalt = undefined) => {
  const salt = userSalt ?? randomBytes(256).toString("hex");
  const hashedpassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");


    return {salt , password :hashedpassword}
};
