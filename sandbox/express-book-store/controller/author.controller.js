import authorsTable from "../models/authors.model.js";
import booksTable from "../models/books.model.js";
import db from "../db/index.js";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

export default {
  getAuthors: async (req, res) => {
    const authors = await db.select().from(authorsTable);
    console.log("hello");
    return res.json(authors);
  },
  getAuthorsByID: async (req, res) => {
    const [author] = await db
      .select()
      .from(authorsTable)
      .where(eq(authorsTable.id, req.params.id));
    if (!author) {
      return res
        .staus(404)
        .json({
          error: ` Author with this id ${req.params.id} doesn't exists`,
        });
    }
    return res.json(author);
  },
  addAuthor: async (req, res) => {
    const { firstName, lastName, email } = req.body;

    const [result] = await db
      .insert(authorsTable)
      .values({
        firstName,
        lastName,
        email,
      })
      .returning({ id: authorsTable.id });

    return res.json({ message: "Author has been created ", id: result.id });
  },
  getBooksByAuthor: async (req, res) => {
    const books = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.authorId, req.params.id));
    return res.json(books);
  },
};
