import {drizzle} from 'drizzle-orm/node-postgres'
import 'dotenv/config'

// we did the connection to the postgress
//postgress://<username>:<password>@<host>:<port>/<db_name>
const db = drizzle(process.env.DATABASE_URL);


export default db