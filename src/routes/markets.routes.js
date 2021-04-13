import express from 'express'
import MarketsController from '../controllers/MarketsController'

const controller = new MarketsController()
const router = express.Router()

router.get('/global/latest', (_, res) => controller.getLatestGlobalMarkets(_, res))
router.get('/global/:period', (req, res) => controller.get24hGlobalMarkets(req, res))
router.get('/defi', (_, res) => controller.getDefiMarkets(_, res))

export default router
