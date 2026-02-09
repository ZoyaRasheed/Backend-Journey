// import { books } from "../models/books.model.js";
import booksTable from "../models/books.model.js";
import authorsTable from "../models/authors.model.js";
import db from "../db/index.js";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

export default {
  // we can have the dynamic data in request too
  getbooks: async (req, res) => {
    //we can sent the custome response headers too ( can start with x-)
    // res.setHeader("x-mine", "zoya");
    

    // we can provide index to the title to speed up the searching
    const search = req.query.search;
    if (search) {
      const books = await db
        .select()
        .from(booksTable)
        .where(sql`to_tsvector('english', ${booksTable.title}) @@ to_tsquery('english', ${search})`);
      return res.json(books);
    }
    const books = await db.select().from(booksTable);
    return res.json(books);
  },

  // we can have the dynamic data in request too
  getBookById: async (req, res) => {
    // const id = parseInt(req.params.id);
    // not need to parse beacuse we are not getting string but uuid

    const id = req.params.id;
    // if (isNaN(id)) {
    //   return res
    //     .status(400)
    //     .json({ error: "Hey its a bad request , send a number" });
    // }
    //const book = books.find((e) => e.id == id);
    const [book] = await db
      .select()
      .from(booksTable)
      .where((table) => eq(table.id, id))
      // adding the foriegn key , as I want the author of the book too from the author id in just one query which is not possible in one query in prisma
      .leftJoin(authorsTable,eq(booksTable.authorId,authorsTable.id))
      .limit(1);

    if (!book)
      return res
        .status(404)
        .json({ error: `Book with id ${id} doesn't exist` });

    return res.status(200).json(book);
  },
  // we can add books too using post request
  addBook: async (req, res) => {
    const { title, description, authorId } = req.body;

    if (!title || title == " ") {
      return res.status(401).json({ error: "Please provide Book title " });
    }
    // if (!author || author.trim() == "") {
    //   return res.status(401).json({ error: "Please provide author" });
    // }
    // const id = books.length + 1;
    // const book = { id: id, bookName, author };
    // books.push(book);

    const [result] = await db
      .insert(booksTable)
      .values({
        title,
        description,
        authorId,
      })
      .returning({
        id: booksTable.id,
      });
    return res
      .status(401)
      .json({ message: "Book created successfully", id: result.id });
  },

  // now we can delete books too
  deleteBookById: async (req, res) => {
    // const id = parseInt(req.params.id);

    const id = req.params.id;
    // if (isNaN(id)) {
    //   return res
    //     .status(400)
    //     .json({ error: "Hey its a bad request , send an Id " });
    // }
    // //findIndex return us either 1 if found the item and -1 if not found the item
    // const indextoDelete = books.findIndex((e) => e.id == id);
    // if (indextoDelete < 0) {
    //   return res
    //     .status(404)
    //     .json({ error: `Book with id ${id} doesn't exist` });
    // }
    // books.splice(indextoDelete, 1);
    await db.delete(booksTable).where(eq(booksTable.id, id));
    return res
      .status(200)
      .json({ message: `Hey the book with id ${id} is deleted ` });
  },
};
