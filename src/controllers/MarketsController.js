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

  getGlobalMarkets(req, res) {
    this.marketService.getGlobalMarkets(req.query.currency_code, req.params.period)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getDefiMarkets(req, res) {
    this.marketService.getDefiMarkets(req.query.currency_code, req.query.diff_period)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getCoinDefiMarkets(req, res) {
    this.marketService.getCoinDefiMarkets(req.params.coinGeckoId, req.query.currency_code, req.params.period)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getLatestCoinDefiMarkets(req, res) {
    this.marketService.getLatestCoinDefiMarkets(req.params.coinGeckoId, req.query.currency_code)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}

export default MarketsController
