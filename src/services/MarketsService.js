import Storage from '../db/Storage'
import logger from '../logger'
import TimePeriod from '../models/TimePeriod'

class MarketsService {
  constructor() {
    this.baseCurrencyCode = 'USD'
  }

  async getXRate(currencyCode, timestamp) {
    let usdXRate = 1
    let resCurrencyCode = currencyCode
    if (currencyCode) {
      if (currencyCode.toUpperCase() !== this.baseCurrencyCode) {
        const result = await Storage.getXRate(timestamp, this.baseCurrencyCode, currencyCode.toUpperCase())
        if (result) usdXRate = result.rate
        else return {}
      }
    } else resCurrencyCode = this.baseCurrencyCode

    return {
      usdXRate,
      currencyCode: resCurrencyCode
    }
  }

  async getLatestGlobalMarkets(currencyCode) {
    try {
      const marketsData = await Storage.getGlobalMarkets((Math.floor(Date.now() / 1000)) - 86400)

      if (marketsData && marketsData.length > 0) {
        const latest = marketsData.pop()
        const data24 = marketsData.shift()

        const xrate = await this.getXRate(currencyCode, latest.timestamp)
        if (!xrate) return {}

        return {
          currency_code: xrate.currencyCode,
          market_cap: latest.marketCap * xrate.usdXRate,
          market_cap_defi: latest.marketCapDefi * xrate.usdXRate,
          volume24h: latest.volume24h * xrate.usdXRate,
          tvl: latest.totalValueLocked * xrate.usdXRate,
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
        let usdXRate = 1
        let resCurrencyCode = currencyCode

        if (currencyCode) {
          if (currencyCode.toUpperCase() !== this.baseCurrencyCode) {
            usdXRates = await Storage.getXRates(
              results.map(r => r.timestamp),
              this.baseCurrencyCode,
              currencyCode.toUpperCase()
            )

            if (Object.keys(usdXRates).length === 0) {
              return {}
            }
          }
        } else resCurrencyCode = this.baseCurrencyCode

        results.forEach(result => {
          if (resCurrencyCode.toUpperCase() !== this.baseCurrencyCode) {
            const xrateResult = usdXRates.find(rate => rate.timestamp === result.timestamp)

            if (xrateResult) {
              usdXRate = xrateResult.rate
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

  async getLatestCoinDefiMarkets(coinGeckoId, currencyCode) {
    try {
      const defiMarket = await Storage.getLatestCoinDefiMarkets(coinGeckoId)

      if (defiMarket) {
        const xrate = await this.getXRate(currencyCode, defiMarket.timestamp)
        if (!xrate) return {}

        return {
          currency_code: xrate.currencyCode,
          coingecko_id: defiMarket.coinInfo.coinGeckoId,
          name: defiMarket.coinInfo.name,
          code: defiMarket.coinInfo.code,
          chains: defiMarket.coinInfo.chains ? defiMarket.coinInfo.chains.split(',') : [],
          image_url: defiMarket.coinInfo.imageUrl,
          timestamp: parseInt(defiMarket.timestamp, 10),
          tvl: defiMarket.totalValueLocked * xrate.usdXRate
        }
      }
    } catch (e) {
      logger.error(`Error getting latest CoinDefiMarkets ${e}`)
    }

    return {}
  }

  async getCoinDefiMarkets(coinGeckoId, currencyCode, period) {
    try {
      const rangePeriod = (Math.floor(Date.now() / 1000)) - TimePeriod.identify(period).seconds
      const results = await Storage.getDefiMarketsByCoin(coinGeckoId, rangePeriod)

      if (results) {
        const coinDefiMarkets = []
        let usdXRates = []
        let usdXRate = 1
        let resCurrencyCode = currencyCode

        if (currencyCode) {
          if (currencyCode.toUpperCase() !== this.baseCurrencyCode) {
            usdXRates = await Storage.getXRates(
              results.map(r => r.timestamp),
              this.baseCurrencyCode,
              currencyCode.toUpperCase()
            )

            if (Object.keys(usdXRates).length === 0) {
              return {}
            }
          }
        } else resCurrencyCode = this.baseCurrencyCode

        results.forEach(result => {
          if (resCurrencyCode.toUpperCase() !== this.baseCurrencyCode) {
            const xrateResult = usdXRates.find(rate => rate.timestamp === result.timestamp)

            if (xrateResult) {
              usdXRate = xrateResult.rate
            }
          }

          const coinDefiMarket = {
            currency_code: resCurrencyCode,
            timestamp: parseInt(result.timestamp, 10),
            tvl: result.tvl * usdXRate
          }

          coinDefiMarkets.push(coinDefiMarket)
        })

        return coinDefiMarkets
      }
    } catch (e) {
      logger.error(`Error getting Coin:${coinGeckoId}, DefiMarkets for period:${period} , ${e}`)
    }

    return {}
  }

  async getDefiMarkets(currencyCode, requestDiffPeriods) {
    try {
      const diffPeriods = requestDiffPeriods || '24h'
      const results = await Storage.getDefiMarkets()

      if (results) {
        if (results.length > 0) {
          const { timestamp } = results[0]

          const xrate = await this.getXRate(currencyCode, timestamp)
          if (!xrate) return {}

          const defiMarkets = results.map(result => ({
            id: result.coin_id,
            currency_code: xrate.currencyCode,
            coingecko_id: result.coingecko_id,
            name: result.name,
            code: result.code,
            chains: result.chains ? result.chains.split(',') : [],
            image_url: result.image_url,
            tvl: result.tvl * xrate.usdXRate
          }))

          // -----------------------------------------------
          // Fetch diff for periods
          if (diffPeriods) {
            const periods = diffPeriods.split(',')
            if (periods.length > 0) {
              await Promise.all(
                periods.map(period => {
                  const timePeriod = TimePeriod.identify(period)
                  const fromTimestamp = (Math.floor(Date.now() / 1000)) - timePeriod.seconds
                  return Storage.getDefiMarketsDiff(fromTimestamp).then(diffResults => {
                    defiMarkets.forEach(dfm => {
                      const found = diffResults.find(dr => dr.coin_id === dfm.id)
                      if (found) {
                        dfm[`tvl_diff_${timePeriod.name}`] = found.tvl_diff
                      }
                    })
                  })
                })
              )
            }
          }
          // -----------------------------------------------

          return defiMarkets
        }
      }
    } catch (e) {
      logger.error(`Error getting DefiMarkets :${e}`)
    }

    return {}
  }
}

export default MarketsService
