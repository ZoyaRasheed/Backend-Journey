import User from "../models/user.model.js";
import { randomBytes, createHmac } from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: `User with this email ${email} already exists` });
  }

  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const user = await User.insertOne({
    name,
    email,
    password: hashedPassword,
    salt,
  });

  return res.status(201).json({ status: "success", data: { id: user._id } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res
      .status(404)
      .json({ error: `User with this email ${email} not found` });
  }

  const salt = existingUser.salt;
  const hashed = existingUser.password;

  const newhash = createHmac("sha256", salt).update(password).digest("hex");

  if (hashed !== newhash) {
    return res.status(400).json({ error: "Passowrd is invalid" });
  }

  const payload = {
    id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return res.status(200).json({ status: "success", token });
};

const update = async (req, res) => {
  const { name } = req.body;
  console.log(req.user);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, 
     { name },
    { new: true });

  return res.json({ status: "success", updatedUser });
};
export { signUp, login, update };
