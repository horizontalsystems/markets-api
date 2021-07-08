class MarketsController {
  constructor(marketsService) {
    this.marketService = marketsService
  }

  getLatestGlobalMarkets(req, res) {
    this.marketService.getLatestGlobalMarkets(req.query.currency_code)
      .then(result => {
        if (result.error) {
          res.status(500).json(result)
        } else {
          res.status(200).json(result)
        }
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getGlobalMarkets(req, res) {
    this.marketService.getGlobalMarkets(req.query.currency_code, req.params.period)
      .then(result => {
        if (result.error) {
          res.status(500).json(result)
        } else {
          res.status(200).json(result)
        }
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getDefiMarkets(req, res) {
    this.marketService.getDefiMarkets(req.query.currency_code, req.query.diff_period, req.query.chain_filter)
      .then(result => {
        if (result.error) {
          res.status(500).json(result)
        } else {
          res.status(200).json(result)
        }
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getCoinDefiMarkets(req, res) {
    this.marketService.getCoinDefiMarkets(req.params.coinGeckoId, req.query.currency_code, req.params.period)
      .then(result => {
        if (result.error) {
          res.status(500).json(result)
        } else {
          res.status(200).json(result)
        }
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }

  getLatestCoinDefiMarkets(req, res) {
    this.marketService.getLatestCoinDefiMarkets(req.params.coinGeckoId, req.query.currency_code)
      .then(result => {
        if (result.error) {
          res.status(500).json(result)
        } else {
          res.status(200).json(result)
        }
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}

export default MarketsController
