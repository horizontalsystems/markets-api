import express from 'express'
import MarketsController from '../controllers/MarketsController'

const controller = new MarketsController()
const router = express.Router()

router.get('/global/latest', (req, res) => controller.getLatestGlobalMarkets(req, res))
router.get('/global/:period', (req, res) => controller.getGlobalMarkets(req, res))
router.get('/defi', (req, res) => controller.getDefiMarkets(req, res))
router.get('/defi/:coinGeckoId/:period', (req, res) => controller.getCoinDefiMarkets(req, res))

export default router
