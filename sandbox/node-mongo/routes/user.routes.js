import express from 'express'
import {signUp, login, update} from '../controller/auth.controller.js'
import { ensureAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.patch('/update',ensureAuthenticated,update )

export default router;