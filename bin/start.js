import 'dotenv/config'

import server from '../src/server'
import models from '../src/models'
import MarketsSyncer from '../src/services/MarketsSyncer'
import MarketInfoProvider from '../src/services/providers/MarketInfoProvider'
import CoingeckoProvider from '../src/services/providers/CoingeckoProvider'
import DefiLlamaProvider from '../src/services/providers/DefiLlamaProvider'
import CoinInfoManager from '../src/managers/CoinInfoManager'

const coingeckoProvider = new CoingeckoProvider()
const defiLlamaProvider = new DefiLlamaProvider()
const marketInfoProvider = new MarketInfoProvider(coingeckoProvider, defiLlamaProvider)
const marketsSyncer = new MarketsSyncer(marketInfoProvider)

server.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`)

  models.sequelize.sync({ force: false }).then(() => {
    CoinInfoManager.init()
    marketsSyncer.start()
  })
})
