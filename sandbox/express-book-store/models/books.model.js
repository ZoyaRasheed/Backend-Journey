import { pgTable, varchar, uuid, text ,index} from "drizzle-orm/pg-core";
import authorsTable from "./authors.model.js";
import { sql } from 'drizzle-orm';

const booksTable = pgTable(
  "books",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 100 }).notNull(),
    description: text(),
    authorId: uuid()
      .references(() => authorsTable.id)
      .notNull(),
  },
  (table) => ({
    searchIndexOnTable: index("title_index").using(
      "gin",
      sql`to_tsvector('english',${table.title})`,
    ),
  }),
);

export default booksTable;











//-- This section is just for learnig purpose ( in Memory Db we can say) if we have not setup postgress
//this is named  export

// to import this you would ned this line : import {books} from 'path"
// if you export default something its default : import mybook from 'path'
// export const books = [
//   { id: 1, bookName: "CS", author: "zoya" },
//   { id: 2, bookName: "Networking", author: "Manish" },
// ];
