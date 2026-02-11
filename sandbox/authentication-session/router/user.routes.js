import express from "express";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { usersSession } from "../db/schema.js";
import { randomBytes, createHmac } from "node:crypto";
import { eq } from "drizzle-orm";
import { create } from "node:domain";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const [existingUser] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (existingUser) {
    return res.json({ error: ` User with this email ${email} already exists` });
  }
  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id });

  return res.status(201).json({ status: true, data: { userId: user.id } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      password: usersTable.password,
      salt: usersTable.salt,
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (!existingUser) {
    return res.json({ error: ` User with this email ${email} doesn't exists` });
  }

  const salt = existingUser.salt;
  const existingHash = existingUser.password;
  const newHash = createHmac("sha256", salt).update(password).digest("hex");

  if (newHash !== existingHash) {
    return res.status(400).json({ error: "Incorrect password" });
  }

  // if email exist and passwor matches you can generate a session for user
  const [session] = await db
    .insert(usersSession)
    .values({
      userId: existingUser.id,
    })
    .returning({ id: usersSession.id });
  return res.json({ status: "success", data: { sessionId: session.id } });
});
export default router;
