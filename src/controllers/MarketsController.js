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

  get24hGlobalMarkets(_, res) {
    this.marketService.get24hGlobalMarkets()
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}

export default MarketsController
