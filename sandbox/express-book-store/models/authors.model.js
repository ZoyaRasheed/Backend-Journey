import {  pgTable , varchar ,uuid } from "drizzle-orm/pg-core";

const authorsTable = pgTable('authors',{
    id: uuid().primaryKey().defaultRandom(),
    firstName: varchar({length: 100}).notNull(),
    lastName : varchar({length : 100}),
    email : varchar({length : 100}).notNull().unique()
})

export default authorsTable