class MarketInfoProvider {
  constructor(coingeckoProvider, defiLlamaProvider) {
    this.coingeckoProvider = coingeckoProvider
    this.defiLlamaProvider = defiLlamaProvider
  }

  async getGlobalMarkets() {
    const globalData = await this.coingeckoProvider.getGlobalMarkets()

    if (globalData) {
      const globalDefiData = await this.coingeckoProvider.getGlobalDefiMarkets()
      const defiLlamaData = await this.defiLlamaProvider.getGlobalDefiMarkets()

      globalData.marketCapDefi = globalDefiData.marketCapDefi
      globalData.totalValueLocked = defiLlamaData.totalValueLocked

      return globalData
    }

    return {}
  }

  async getDefiMarkets() {
    try {
      const defiLlamaData = await this.defiLlamaProvider.getDefiMarkets()
      if (defiLlamaData) {
        const now = Math.floor(Date.now() / 1000)

        const defiMarkets = defiLlamaData.data.map(data => ({
          id: data.id,
          name: data.name,
          code: data.symbol,
          address: data.address,
          defillamaId: data.name.toLowerCase().trim().replace(/ /g, '-'),
          coinGeckoId: data.gecko_id,

          defiMarkets: {
            timestamp: now,
            totalValueLocked: data.tvl
          }
        }))

        return defiMarkets
      }
    } catch (e) {
      console.log(`Error fetching defimarkets!${e}`)
    }

    return {}
  }
}

export default MarketInfoProvider
