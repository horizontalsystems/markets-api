import MarketsService from '../services/MarketsService'

class MarketsController {
  constructor() {
    this.marketService = new MarketsService()
  }

  getLatestGlobalMarkets(res) {
    this.marketService.getLatestGlobalMarkets()
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getGlobalMarkets(req, res) {
    this.marketService.getGlobalMarkets(req.query.toTimestamp)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}

export default MarketsController
