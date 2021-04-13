import MarketsService from '../services/MarketsService'

class MarketsController {
  constructor() {
    this.marketService = new MarketsService()
  }

  getLatestGlobalMarkets(_, res) {
    this.marketService.getLatestGlobalMarkets()
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  get24hGlobalMarkets(req, res) {
    this.marketService.getGlobalMarkets(req.param.period)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getDefiMarkets(_, res) {
    this.marketService.getDefiMarkets()
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}

export default MarketsController
