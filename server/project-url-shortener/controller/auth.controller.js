import {
  loginPostRequestBodySchema,
  signupPostRequestBodySchema,
} from "../validations/request.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserbyEmail } from "../services/user.service.js";
import { createUser } from "../services/user.service.js";
import { createUserToken } from "../utils/token.js";
import "dotenv/config";

const signup = async (req, res) => {
  //   const { firstname, lastname, email, password } = req.body;
     console.log(req.body)
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }
  // destructure the data from the validation result if no error
  const { firstname, lastname, email, password } = validationResult.data;

  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

  const existingUser = await getUserbyEmail(email);

  if (existingUser)
    return res
      .status(400)
      .json({ error: ` User with this email ${email} already exists` });

  const user = await createUser(
    firstname,
    lastname,
    email,
    hashedPassword,
    salt,
  );

  return res.status(201).json({ data: { userId: user.id } });
};

const login = async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }
  const { email, password } = validationResult.data;

  const user = await getUserbyEmail(email);
  if (!user) {
    return res
      .status(400)
      .json({ error: ` User with this email ${email} don't exists` });
  }
  const { password: hashedpassword } = hashPasswordWithSalt(
    password,
    user.salt,
  );

  if (user.password != hashedpassword) {
    return res.status(400).json({ error: "Inavlid password" });
  }

  const token = await createUserToken({ id: user.id });
  return res.status(200).json({ token });
};


export { signup, login };
