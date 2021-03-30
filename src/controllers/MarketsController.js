import Storage from '../db/Storage'

class MarketsController {
  index(req, res) {
    Storage.getLatestMarkets()
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => {
          res.status(500).send(error)
        })
  }

  show(req, res) {
    res.send({})
  }
}

export default MarketsController
