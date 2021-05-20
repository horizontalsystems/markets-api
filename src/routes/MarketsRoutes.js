import MarketsController from '../controllers/MarketsController';

class MarketsRoutes {
  constructor(router, marketsService) {
    this.controller = new MarketsController(marketsService);
    this.router = router

    this.router.get('/global/latest', (req, res) => this.controller.getLatestGlobalMarkets(req, res))
    this.router.get('/global/:period', (req, res) => this.controller.getGlobalMarkets(req, res))
    this.router.get('/defi', (req, res) => this.controller.getDefiMarkets(req, res))
    this.router.get('/defi/:coinGeckoId/latest', (req, res) => this.controller.getLatestCoinDefiMarkets(req, res))
    this.router.get('/defi/:coinGeckoId/:period', (req, res) => this.controller.getCoinDefiMarkets(req, res))
  }

  getRouter() {
    return this.router
  }
}

export default MarketsRoutes
