import {  pgTable , varchar ,uuid ,text} from "drizzle-orm/pg-core";
import authorsTable from "./authors.model.js";

const booksTable = pgTable("books",{
  id:uuid().primaryKey().defaultRandom(),
  title: varchar({length : 100}).notNull(),
  description : text(),
  authorId : uuid().references(()=> authorsTable.id).notNull()
})

export default booksTable



//-- This section is just for learnig purpose ( in Memory Db we can say) if we have not setup postgress 
//this is named  export 

// to import this you would ned this line : import {books} from 'path"
// if you export default something its default : import mybook from 'path'
// export const books = [
//   { id: 1, bookName: "CS", author: "zoya" },
//   { id: 2, bookName: "Networking", author: "Manish" },
// ];
