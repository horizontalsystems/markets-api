import Storage from '../db/Storage'
import logger from '../logger'
import TimePeriod from '../models/TimePeriod'

class MarketsService {
  async getLatestGlobalMarkets() {
    try {
      const marketsData = await Storage.getGlobalMarkets((Math.floor(Date.now() / 1000)) - 86400)

      if (marketsData && marketsData.length > 0) {
        const latest = marketsData.shift()
        const data24 = marketsData.pop()

        return {
          market_cap: latest.marketCap,
          market_cap_defi: latest.marketCapDefi,
          volume24h: latest.volume24h,
          tvl: latest.totalValueLocked,
          dominance_btc: latest.dominanceBTC,
          market_cap_diff_24h: ((latest.marketCap - data24.marketCap) * 100) / data24.marketCap,
          market_cap_defi_diff_24h: ((latest.marketCapDefi - data24.marketCapDefi) * 100) / data24.marketCapDefi,
          dominance_btc_diff_24h: ((latest.dominanceBTC - data24.dominanceBTC) * 100) / data24.dominanceBTC,
          volume24h_diff: ((latest.volume24h - data24.volume24h) * 100) / data24.volume24h,
          tvl_diff_24h: ((latest.totalValueLocked - data24.totalValueLocked) * 100) / data24.totalValueLocked
        }
      }
    } catch (e) {
      logger.error(e)
    }

    return {}
  }

  async getGlobalMarkets(period) {
    const rangePeriod = (Math.floor(Date.now() / 1000)) - TimePeriod.identify(period).seconds
    const results = await Storage.getGlobalMarkets(rangePeriod)
    return results.map(market => ({
      timestamp: market.timestamp,
      market_cap: market.marketCap,
      market_cap_defi: market.marketCapDefi,
      volume24h: market.volume24h,
      tvl: market.totalValueLocked,
      dominance_btc: market.dominanceBTC
    }))
  }

  async getDefiMarkets() {
    try {
      const i24h = (Math.floor(Date.now() / 1000)) - 86400
      const defiMarkets = await Storage.getDefiMarkets(i24h)

      if (defiMarkets) {
        if (defiMarkets.length > 0) {
          return defiMarkets.map(coinData => ({
            coingecko_id: coinData.coingecko_id,
            name: coinData.name,
            code: coinData.code,
            tvl: coinData.totalvaluelocked,
            tvl_diff_24h: coinData.totalvaluelockeddiff24h
          }))
        }
      }
    } catch (e) {
      logger.error(e)
    }

    return {}
  }
}

export default MarketsService
