import cron from 'node-cron'
import Storage from '../db/Storage'

const EVERY_20M = '0 */20 * * * *' // every 20 min

class MarketsSyncer {
  constructor(marketInfoProvider) {
    this.marketInfoProvider = marketInfoProvider
  }

  start() {
    try {
      cron.schedule(EVERY_20M, this.syncMarkets.bind(this))
    } catch (e) {
      console.error(e.stack)
    }
  }

  syncMarkets() {
    this.marketInfoProvider.getGlobalMarkets().then(data => {
      Storage.saveGlobalMarkets(data)
    })
  }
}

export default MarketsSyncer
