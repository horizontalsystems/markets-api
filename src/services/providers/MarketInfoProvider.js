import logger from '../../logger'
import Utils from '../../utils/Utils'

class MarketInfoProvider {
  constructor(coingeckoProvider, defiLlamaProvider) {
    this.coingeckoProvider = coingeckoProvider
    this.defiLlamaProvider = defiLlamaProvider
    this.latestGlobalTvl = 0
    this.latestGlobalVolume24h = 0
  }

  async getGlobalMarkets(timestamp) {
    const globalData = await this.coingeckoProvider.getGlobalMarkets()

    if (globalData) {
      const globalDefiData = await this.coingeckoProvider.getGlobalDefiMarkets()
      const defiLlamaData = await this.defiLlamaProvider.getGlobalDefiMarkets()

      globalData.timestamp = timestamp
      globalData.marketCapDefi = globalDefiData.marketCapDefi

      if (this.checkValues(this.latestGlobalVolume24h, globalData.volume24h)) {
        this.latestGlobalVolume24h = globalData.volume24h
      } else {
        globalData.volume24h = this.latestGlobalVolume24h
      }

      if (this.checkValues(this.latestGlobalTvl, defiLlamaData.totalValueLocked)) {
        globalData.totalValueLocked = defiLlamaData.totalValueLocked
        this.latestGlobalTvl = defiLlamaData.totalValueLocked
      } else {
        globalData.totalValueLocked = this.latestGlobalTvl
      }

      return globalData
    }

    return {}
  }

  checkValues(latestValue, newValue) {
    if (latestValue === 0) {
      return true
    }

    const diff = (Math.abs(latestValue - newValue) * 100) / latestValue
    if (diff <= 20) {
      return true
    }
    return false
  }

  async getDefiMarkets(timestamp) {
    try {
      const defiLlamaData = await this.defiLlamaProvider.getDefiMarkets()

      if (defiLlamaData) {
        const defiMarkets = []
        defiLlamaData.data.sort(Utils.sortByPropertyDesc('tvl'))

        defiLlamaData.data.forEach((data, i) => {
          if (data.tvl > 0 && data.tvl < 100000000000) {
            const chainDefiMarkets = []

            if (Object.keys(data.chainTvls).length > 0) {
              Object.keys(data.chainTvls).forEach(key => {
                let tvl = data.chainTvls[key]
                if (Object.keys(data.chainTvls).length === 1 && data.chainTvls[key] === 0) {
                  tvl = data.tvl
                }

                chainDefiMarkets.push({
                  timestamp,
                  chain: key.toLowerCase(),
                  totalValueLocked: tvl
                })
              })
            } else {
              chainDefiMarkets.push({
                timestamp,
                chain: data.chain.toLowerCase(),
                totalValueLocked: data.tvl
              })
            }

            defiMarkets.push({
              id: data.id,
              name: data.name,
              code: data.symbol,
              address: data.address,
              tvlRank: parseInt(i + 1, 10),
              imageUrl: data.logo,
              chain: data.chain.toLowerCase(),
              chains: data.chains ? data.chains.join(',').toLowerCase() : '',
              coinGeckoId: data.gecko_id ? data.gecko_id.trim() : '',

              defiMarkets: {
                timestamp,
                totalValueLocked: data.tvl
              },

              chainDefiMarkets
            })
          }
        })

        return defiMarkets
      }
    } catch (e) {
      logger.error(`Error fetching defimarkets!${e}`)
    }

    return {}
  }

  async getCurrencyXRates(baseCurrency, currencyCodeList, timestamp) {
    try {
      let currencies

      if (Object.keys(currencyCodeList).length > 0) currencies = currencyCodeList.join(',')
      else currencies = 'USD'

      const result = await this.coingeckoProvider.getXRates('bitcoin', currencies)
      if (result) {
        const xrates = []
        const coinResult = result.bitcoin
        let usdXRate = 1
        currencyCodeList.forEach(currencyCode => {
          try {
            if (currencyCode.toUpperCase() === baseCurrency) {
              usdXRate = parseFloat(coinResult[currencyCode.toLowerCase()])
            } else {
              const currencyXRate = parseFloat(coinResult[currencyCode.toLowerCase()])
              const rate = currencyXRate / usdXRate
              const xrate = {
                timestamp,
                sourceCode: baseCurrency.toUpperCase(),
                targetCode: currencyCode.toUpperCase(),
                rate
              }
              xrates.push(xrate)
            }
          } catch (e) {
            // ignore
          }
        })

        return xrates
      }
    } catch (e) {
      logger.error(`Error fetching xrates!${e}`)
    }

    return {}
  }
}

export default MarketInfoProvider
