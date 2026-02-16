import express from "express";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { usersSession } from "../db/schema.js";
import { randomBytes, createHmac } from "node:crypto";
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken'

const router = express.Router();


// this session based authentication is not used widely , beause it make alot of db calls and make database overwhelmed and add latency too , thats why its called server stateful authentication but one plus point you can make the user logout through database , it na be sued widely in banking apps where the security is important 
router.post("/", async (req, res) => {
  //const sessionId = req.headers["session-id"];
  // if (!sessionId) {
  //   return res.status(401).json({ error: " You are not logged in " });
  // }


  //--------------- when we use token in headers the standardization is : 
  // Headers Authorization : Bearer <Token> 
  const tokenHeader = req.headers('authorization')
  if(!tokenHeader){
     return res.status(401).json({ error: " You are not logged in " });
  }
  if(!tokenHeader.startsWith('Bearer')){
         return res.status(400).json({ error: "It should start with bearer " });
  }
   const token = tokenHeader.split(" ")[1]
   const decoded = jwt.verify(token , process.env.JWT_SECRET)

  req.user = decoded 

  // in this way there is no db call
  // we can use " user" from request body as a middleware ( which checked that user is logged in)

  //------ const [data] = await db
  //   .select({
  //     id : usersSession.id,
  //     userId : usersSession.userId,
  //     name : usersTable.name,
  //     email : usersTable.email
  //   })
  //   .from(usersSession)
  //   .rightJoin(usersTable, eq(usersTable.id , usersSession.userId))
  //   .where((table) => eq(table.id, sessionId));

  //   if(!data){
  //         return res.status(401).json({ error: " You are not logged in " });
  //   }
  //   return res.json({ mydata : data});
}
);// to see the current logged in user , we can use i as middleware too

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
      role : usersTable.role
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

  //-------------------- if email exist and passwor matches you can generate a session for user
  // const [session] = await db
  //   .insert(usersSession)
  //   .values({
  //     userId: existingUser.id,
  //   })
  //   .returning({ id: usersSession.id });
  // return res.json({ status: "success", data: { sessionId: session.id } });

  // --------------Now instead of the session generation we are going to generate a token(JWT) 
  const payload = {
    id: existingUser.id,
    name : existingUser.name,
    email: existingUser.email,
    role : existingUser.role
  }
   // no need to store the token in the database 
  const token = jwt.sign(payload,process.env.JWT_SECRET)
  return res.json({ status: "success", token});
});
export default router;
