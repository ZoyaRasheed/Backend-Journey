import express from "express";
import bookRouter from "./Routers/book.routes.js";
import authorRouter from "./Routers/author.routes.js"
import loggermiddleware from './middlewares/logger.js'
import 'dotenv/config'

//Keeping all the content into the separate files--> Model-View-Controller (MVC) pattern, which is crucial for building scalable API architectures. 
const app = express();
const PORT = 3000;

// Midllewares (plugins)
// we use this middleware so that whatever dat is coming from frontend wuld be received in json and can be processed by express and would not give error f "undefinded'"
app.use(express.json())

// this line is for doing it using router folder too 
app.use('/books',bookRouter)
app.use('/authors',authorRouter)
app.use(loggermiddleware)


const onListening = ()=>{
  console.log(`Server is running on port ${PORT}`)
}
app.listen(PORT, onListening);
