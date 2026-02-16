import express from 'express'
import userRouter from './router/user.routes.js'
import adminRouter from './router/admin.routes.js'
const app = express()
const PORT = process.env.PORT ?? 8000

app.use(express.json())
app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.get('/',(_req,_res)=>{
    console.log('Server is up and running')
})

app.listen(PORT, ()=> console.log(`Server is running on PORT : ${PORT}`))