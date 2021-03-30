import 'dotenv/config'

import server from '../src/server'
import models from '../src/models'
import MarketsService from '../src/services/MarketsService'
import MarketInfoProvider from '../src/services/providers/MarketInfoProvider'
import CoingeckoProvider from '../src/services/providers/CoingeckoProvider'
import DefiLlamaProvider from '../src/services/providers/DefiLlamaProvider'

const coingeckoProvider = new CoingeckoProvider()
const defiLlamaProvider = new DefiLlamaProvider()
const marketInfoProvider = new MarketInfoProvider(coingeckoProvider, defiLlamaProvider)
const marketsService = new MarketsService(marketInfoProvider)

server.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`)

  models.sequelize.sync({ force: false })
  marketsService.start()
})
