import express from 'express'
import MarketsController from '../controllers/MarketsController'

const controller = new MarketsController()
const router = express.Router()

router.get('/', controller.index)
router.get('/:id', controller.show)

export default router
