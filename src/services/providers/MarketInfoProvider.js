import logger from '../../logger'

class MarketInfoProvider {
  constructor(coingeckoProvider, defiLlamaProvider) {
    this.coingeckoProvider = coingeckoProvider
    this.defiLlamaProvider = defiLlamaProvider
    this.latestTvl = 0
  }

  async getGlobalMarkets(timestamp) {
    const globalData = await this.coingeckoProvider.getGlobalMarkets()

    if (globalData) {
      const globalDefiData = await this.coingeckoProvider.getGlobalDefiMarkets()
      const defiLlamaData = await this.defiLlamaProvider.getGlobalDefiMarkets()

      globalData.timestamp = timestamp
      globalData.marketCapDefi = globalDefiData.marketCapDefi
      if (defiLlamaData.totalValueLocked > 0) {
        globalData.totalValueLocked = defiLlamaData.totalValueLocked
        this.latestTvl = defiLlamaData.totalValueLocked
      } else {
        globalData.totalValueLocked = this.latestTvl
      }

      return globalData
    }

    return {}
  }

  async getDefiMarkets(timestamp) {
    try {
      const defiLlamaData = await this.defiLlamaProvider.getDefiMarkets()
      if (defiLlamaData) {
        const defiMarkets = defiLlamaData.data.map(data => ({
          id: data.id,
          name: data.name,
          code: data.symbol,
          address: data.address,
          imageUrl: data.logo,
          chains: data.chains,
          defillamaId: data.name.toLowerCase().trim().replace(/ /g, '-'),
          coinGeckoId: data.gecko_id,

          defiMarkets: {
            timestamp,
            totalValueLocked: data.tvl
          }
        }))

        return defiMarkets
      }
    } catch (e) {
      logger.log(`Error fetching defimarkets!${e}`)
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
      logger.log(`Error fetching xrates!${e}`)
    }

    return {}
  }
}

export default MarketInfoProvider
