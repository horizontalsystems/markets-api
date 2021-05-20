import 'dotenv/config'

import Server from '../src/Server'
import models from '../src/models'
import MarketsSyncer from '../src/services/MarketsSyncer'
import MarketsService from '../src/services/MarketsService'
import TokenInfoService from '../src/services/TokenInfoService'
import MarketInfoProvider from '../src/services/providers/MarketInfoProvider'
import TokenInfoProvider from '../src/services/providers/TokenInfoProvider'
import CoingeckoProvider from '../src/services/providers/CoingeckoProvider'
import DefiLlamaProvider from '../src/services/providers/DefiLlamaProvider'
import EthplorerProvider from '../src/services/providers/EthplorerProvider'
import CoinInfoManager from '../src/managers/CoinInfoManager'
import coinConfig from '../src/managers/coins.info.json'

const coingeckoProvider = new CoingeckoProvider()
const defiLlamaProvider = new DefiLlamaProvider()
const ethplorerProvider = new EthplorerProvider()
const marketInfoProvider = new MarketInfoProvider(coingeckoProvider, defiLlamaProvider)
const tokenInfoProvider = new TokenInfoProvider(ethplorerProvider)
const marketsService = new MarketsService()
const tokenInfoService = new TokenInfoService(tokenInfoProvider)
const marketsSyncer = new MarketsSyncer(marketInfoProvider, coinConfig.supported_currencies)
const coinInfoManager = new CoinInfoManager()
const server = new Server(marketsService, tokenInfoService)

models.sequelize.sync({ force: false }).then(() => {
  coinInfoManager.init()
  marketsSyncer.start()
  server.start()
})
