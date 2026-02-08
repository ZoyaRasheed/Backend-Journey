import db from './db/index.js'
// import { usersTable } from './drizzle/schema.js'
import { usersTable } from './Drizzle/schema.js'
import 'dotenv/config'

async function getAllusers(){
    const users = await db.select().from(usersTable)
    console.log("These are my users " ,users)
    return users;
}

async function createUser({id,email,name}){
    await db.insert(usersTable).values({
        id,
        name,
        email
    })
}
getAllusers()
// createUser({id:1,name:"zoya",email:"zoyaa4840@gmail.com"})
// createUser({id:2,name:"waleed",email:"waleed4840@gmail.com"})