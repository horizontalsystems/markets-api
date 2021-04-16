import cron from 'node-cron'
import Storage from '../db/Storage'
import logger from '../logger'

const EVERY_20M = '0 */20 * * * *' // every 20 min

class MarketsSyncer {
  constructor(marketInfoProvider, currencies) {
    this.marketInfoProvider = marketInfoProvider
    this.currencyCodes = currencies.map(item => item.code)
    this.baseCurrencyCode = 'USD'
  }

  start() {
    try {
      cron.schedule(EVERY_20M, this.syncMarkets.bind(this))
    } catch (e) {
      logger.error(e.stack)
    }
  }

  async syncMarkets() {
    const now = Math.floor(Date.now() / 1000)
    this.syncGlobalMarkets(now)
    await new Promise(r => setTimeout(r, 1000));
    this.syncDefiMarkets(now)
    await new Promise(r => setTimeout(r, 1000));
    this.syncXRates(now)
  }

  syncGlobalMarkets(now) {
    this.marketInfoProvider.getGlobalMarkets(now).then(data => {
      Storage.saveGlobalMarkets(data)
    }).catch(e => logger.error(e.stack));
  }

  async syncDefiMarkets(now) {
    this.marketInfoProvider.getDefiMarkets(now).then(data => {
      Storage.saveCoinInfoDetails(data)
    }).catch(e => logger.error(e.stack));
  }

  async syncXRates(now) {
    this.marketInfoProvider.getCurrencyXRates(this.baseCurrencyCode, this.currencyCodes, now).then(data => {
      Storage.saveXRates(data)
    }).catch(e => logger.error(e.stack));
  }
}

export default MarketsSyncer
