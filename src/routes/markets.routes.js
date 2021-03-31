import express from 'express'
import MarketsController from '../controllers/MarketsController'

const controller = new MarketsController()
const router = express.Router()

router.get('/global/latest', (_, res) => controller.getLatestGlobalMarkets(res))
router.get('/global', (req, res) => controller.getGlobalMarkets(req, res))

export default router
