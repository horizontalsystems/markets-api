import express from 'express'
import CryptoNewsController from '../controllers/CryptoNewsContoller'

const controller = new CryptoNewsController()
const router = express.Router()

router.get('/latest', (req, res) => controller.getLatestNews(req, res))

export default router
