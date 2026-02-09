import  { Router } from 'express'
import bookController from '../controller/book.controller.js';
const router = Router()

router.get("/",bookController.getbooks);
router.get("/:id", bookController.getBookById);
router.post('/',bookController.addBook)
router.delete('/:id',bookController.deleteBookById)

export default router 
