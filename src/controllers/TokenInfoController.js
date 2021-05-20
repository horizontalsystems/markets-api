class TokenInfoController {
  constructor(tokenInfoService) {
    this.tokenInfoService = tokenInfoService
  }

  getTopTokenHolders(req, res) {
    this.tokenInfoService.getTopTokenHolders(req.params.tokenAddress, req.query.limit)
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

export default TokenInfoController
