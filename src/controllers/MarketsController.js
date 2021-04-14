import MarketsService from '../services/MarketsService'

class MarketsController {
  constructor() {
    this.marketService = new MarketsService()
  }

  getLatestGlobalMarkets(req, res) {
    this.marketService.getLatestGlobalMarkets(req.query.currency_code)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  get24hGlobalMarkets(req, res) {
    this.marketService.getGlobalMarkets(req.query.currency_code, req.param.period)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getDefiMarkets(req, res) {
    this.marketService.getDefiMarkets(req.query.currency_code)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}

export default MarketsController
