import CryptoNewsService from '../services/CryptoNewsService'

class CyrptoNewsController {
  constructor() {
    this.cryptoNewsService = new CryptoNewsService()
  }

  getLatestNews(_, res) {
    this.cryptoNewsService.getLatestNews()
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}

export default CyrptoNewsController
