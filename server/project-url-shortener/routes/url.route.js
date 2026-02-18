import express from 'express'
import {shorten, shortCode, codes, deleteCodes} from '../controller/url.controller.js'
import { ensureAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/shorten',ensureAuthenticated,shorten)
router.get('/allCodes',ensureAuthenticated,codes)
router.delete('/:id',ensureAuthenticated,deleteCodes)
//shortCode route is public route and we don't need authentication
router.get('/:shortCode',shortCode)

export default router 