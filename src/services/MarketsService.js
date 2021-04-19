import Storage from '../db/Storage'
import logger from '../logger'
import TimePeriod from '../models/TimePeriod'

class MarketsService {
  constructor() {
    this.baseCurrencyCode = 'USD'
  }

  async getLatestGlobalMarkets(currencyCode) {
    try {
      const marketsData = await Storage.getGlobalMarkets((Math.floor(Date.now() / 1000)) - 86400)

      if (marketsData && marketsData.length > 0) {
        const latest = marketsData.shift()
        const data24 = marketsData.pop()

        let usdXRate = 1
        let resCurrencyCode = currencyCode
        if (currencyCode) {
          if (currencyCode.toUpperCase() !== this.baseCurrencyCode) {
            const result = await Storage.getXRate(latest.timestamp, this.baseCurrencyCode, currencyCode.toUpperCase())
            if (result) usdXRate = result.rate
            else return {}
          }
        } else resCurrencyCode = this.baseCurrencyCode

        return {
          currency_code: resCurrencyCode,
          market_cap: latest.marketCap * usdXRate,
          market_cap_defi: latest.marketCapDefi * usdXRate,
          volume24h: latest.volume24h * usdXRate,
          tvl: latest.totalValueLocked * usdXRate,
          dominance_btc: latest.dominanceBTC,
          market_cap_diff_24h: ((latest.marketCap - data24.marketCap) * 100) / data24.marketCap,
          market_cap_defi_diff_24h: ((latest.marketCapDefi - data24.marketCapDefi) * 100) / data24.marketCapDefi,
          dominance_btc_diff_24h: ((latest.dominanceBTC - data24.dominanceBTC) * 100) / data24.dominanceBTC,
          volume24h_diff: ((latest.volume24h - data24.volume24h) * 100) / data24.volume24h,
          tvl_diff_24h: ((latest.totalValueLocked - data24.totalValueLocked) * 100) / data24.totalValueLocked
        }
      }
    } catch (e) {
      logger.error(`Error getting latest GlobalMarkets ${e}`)
    }

    return {}
  }

  async getGlobalMarkets(currencyCode, period) {
    try {
      const rangePeriod = (Math.floor(Date.now() / 1000)) - TimePeriod.identify(period).seconds
      const results = await Storage.getGlobalMarkets(rangePeriod)

      if (results) {
        const globalMarkets = []
        let usdXRates = []
        const usdXRate = 1
        let resCurrencyCode = currencyCode

        if (currencyCode) {
          if (currencyCode.toUpperCase() !== this.baseCurrencyCode) {
            usdXRates = await Storage.getXRates(
              results.map(r => r.timestamp),
              this.baseCurrencyCode,
              currencyCode.toUpperCase()
            )

            if (Object.keys(usdXRates).length === 0 || Object.keys(usdXRates).length !== results.length) {
              return {}
            }
          }
        } else resCurrencyCode = this.baseCurrencyCode

        results.forEach(result => {
          if (resCurrencyCode.toUpperCase() !== this.baseCurrencyCode) {
            const xrateResult = usdXRates.find(rate => rate.timestamp === result.timestamp)

            if (xrateResult) {
              usdXRates = xrateResult.rate
            }
          }

          const globalMarket = {
            currency_code: resCurrencyCode,
            timestamp: parseInt(result.timestamp, 10),
            market_cap: result.marketCap * usdXRate,
            market_cap_defi: result.marketCapDefi * usdXRate,
            volume24h: result.volume24h * usdXRate,
            tvl: result.totalValueLocked * usdXRate,
            dominance_btc: result.dominanceBTC
          }

          globalMarkets.push(globalMarket)
        })

        return globalMarkets
      }
    } catch (e) {
      logger.error(`Error getting GlobalMarkets for period:${period} , ${e}`)
    }

    return {}
  }

  async getDefiMarkets(currencyCode) {
    try {
      const i24h = (Math.floor(Date.now() / 1000)) - 86400
      const results = await Storage.getDefiMarkets(i24h)

      if (results) {
        if (results.length > 0) {
          const { timestamp } = results[0]
          let usdXRate = 1
          let resCurrencyCode = currencyCode
          if (currencyCode) {
            if (currencyCode.toUpperCase() !== this.baseCurrencyCode) {
              const result = await Storage.getXRate(timestamp, this.baseCurrencyCode, currencyCode.toUpperCase())
              if (result) usdXRate = result.rate
              else return {}
            }
          } else resCurrencyCode = this.baseCurrencyCode

          if (results.length > 0) {
            return results.map(result => ({
              currency_code: resCurrencyCode,
              coingecko_id: result.coingecko_id,
              name: result.name,
              code: result.code,
              image_url: result.image_url,
              tvl: result.tvl * usdXRate,
              tvl_diff_24h: result.tvl_diff
            }))
          }
        }
      }
    } catch (e) {
      logger.error(`Error getting DefiMarkets :${e}`)
    }

    return {}
  }
}

export default MarketsService
