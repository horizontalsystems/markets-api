import TokenInfoController from '../controllers/TokenInfoController';

class TokenInfoRoutes {
  constructor(router, tokenInfoService) {
    this.controller = new TokenInfoController(tokenInfoService);
    this.router = router

    this.router.get('/holders/:tokenAddress', (req, res) => this.controller.getTopTokenHolders(req, res))
  }

  getRouter() {
    return this.router
  }
}

export default TokenInfoRoutes
