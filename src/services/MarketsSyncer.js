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

  async syncMarkets() {
    this.syncGlobalMarkets()
    await new Promise(r => setTimeout(r, 1000));
    this.syncDefiMarkets()
  }

  syncGlobalMarkets() {
    try {
      this.marketInfoProvider.getGlobalMarkets().then(data => {
        Storage.saveGlobalMarkets(data)
      })
    } catch (e) {
      console.error(e.stack)
    }
  }

  async syncDefiMarkets() {
    try {
      this.marketInfoProvider.getDefiMarkets().then(data => {
        Storage.saveCoinInfoDetails(data)
      })
    } catch (e) {
      console.error(e.stack)
    }
  }
}

export default MarketsSyncer
