import { Router } from 'express'
import MarketsRoutes from './MarketsRoutes'
import TokenInfoRoutes from './TokenInfoRoutes'

class AppRoutes {
  constructor(marketsService, tokenInfoService) {
    this.routerApi = new Router()
    this.marketsRoutes = new MarketsRoutes(this.routerApi, marketsService)
    this.tokenInfoRoutes = new TokenInfoRoutes(this.routerApi, tokenInfoService)
    this.routerApi.use('/api/v1/markets/', this.marketsRoutes.getRouter());
    this.routerApi.use('/api/v1/tokens/', this.tokenInfoRoutes.getRouter());
  }

  getRouter() {
    return this.routerApi
  }
}

export default AppRoutes
