import db from "../db/index.js";
import { urlsTable } from "../models/url.model.js";
import { and, eq } from "drizzle-orm";

export const createURL = async (url, shortcode, userId) => {
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode: shortcode,
      targetURL: url,
      userId: userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return result;
};

export const redirectUser = async (shortCode) => {
  const [result] = await db
    .select({
      targetURL: urlsTable.targetURL,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, shortCode));

  return result;
};

export const getCodes = async (userId) => {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, userId));

    return codes
};


export const deleteCode = async(id,userId)=>{
    // await db.delete(urlsTable).where(eq(urlsTable.id,id))
  // now here the problem is any authenticated user can delete the codes of another user if somehow got the id of another user
  // so we are going to put and statement here
   const result = await db.delete(urlsTable).where(and(
    eq(urlsTable.id,id),
    eq(urlsTable.userId,userId)
   )).returning({
    targetURL : urlsTable.targetURL
   })

   return result
}