import express from 'express'
import 'dotenv/config'
import { connectionMongodb } from './connection.js'
import userRouter from './routes/user.routes.js'
import { authMiddleware } from './middlewares/auth.middleware.js'


const app = express()
const PORT = process.env.PORT

connectionMongodb(process.env.MONGODB_URI).then(()=>{
    console.log('MongoDb connected')
})
app.use(express.json())
app.use(authMiddleware)

app.use('/user',userRouter)

app.listen(PORT, ()=> console.log(`Server is running on PORT ${PORT}`))