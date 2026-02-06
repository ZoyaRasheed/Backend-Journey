import express from 'express'

const app = express()

app.get('/', (req,res)=>{
    res.status(200).end('Hey Homepage')
})

app.listen(3000, ()=>{
      console.log("Server is running");
})
