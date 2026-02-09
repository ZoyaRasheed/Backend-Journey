import  { Router } from 'express'
import authorController from '../controller/author.controller.js'
const router = Router()

router.get("/", authorController.getAuthors);
router.get("/:id", authorController.getAuthorsByID);
router.post('/',authorController.addAuthor)
router.get("/:id/books", authorController.getBooksByAuthor);

export default router 
