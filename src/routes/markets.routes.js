import express from 'express'
import MarketsController from '../controllers/MarketsController'

const controller = new MarketsController()
const router = express.Router()

router.get('/global/latest', (_, res) => controller.getLatestGlobalMarkets(_, res))
router.get('/global/24h', (_, res) => controller.get24hGlobalMarkets(_, res))

export default router
