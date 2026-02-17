import express from 'express'
import 'dotenv/config'
import userRouter from './routes/user.route.js'
import { authenticationMiddleware } from './middlewares/auth.middleware.js'

const app= express()

app.use(express.json())
app.use(authenticationMiddleware)
app.use('/users',userRouter)

const PORT = process.env.PORT ?? 8000

app.listen(PORT, ()=> console.log(`Server is up and running at PORT ${PORT}`))