import express from 'express'
import { usersTable } from '../db/schema.js'
import db from '../db/index.js'
const router = express.Router()

router.get('/users', async (req, res)=>{
    // for example we can say that admin would be able t see the list of all users.

    const users = await db.select({
        name : usersTable.name,
        email : usersTable.email,
        id : usersTable.id
    }).from(usersTable)
    return res.json({users})
})

export default router;