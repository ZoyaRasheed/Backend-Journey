import express from 'express'
import fs from 'fs'
const app = express()

app.use(express.json())

// this is a middelware , before the request getting to the route it passes through the middleware , if this middleware doesnt not respond and send the next function th request woud never be able to reach the route
app.use((req,res,next)=>{
     console.log('hello i am middleware A ')
     next()
})

// We can have global middlewares (run everytime), route level middlewares, router middlewares
// this is the custom middleware we created and whenver we request this runs and send the request to the route 
const loggermiddleware = (req,res,next)=>{
    const log = `${Date.now()}  ${req.method} ${req.path}`
    fs.writeFileSync('log.txt',log,'utf-8')
    next()
}
app.use(loggermiddleware)

// let give he middleware to route as well:
const custommiddleware = (req,res,next)=>{
    console.log("Helloe I am custom middleware")
}
app.get('/',custommiddleware , (req,res)=>{
 return res.status(200).end('working')
})

// In this file first the express.json() middleware would run and then the Middleware A efinded would run , then the logger middleware would run then the request would reach the route but there we have another custom middleware and then next would be the route body executed in sequence ( any of these have missing next would halt the request from reaching the route)

// also here we can also have middlewares for the matching router 
app.use('/app',(req,res,next)=>{
    console.log('I would run always if /app get hits')
    next()
})
app.listen(3000,()=>{
    console.log('server is running')
})