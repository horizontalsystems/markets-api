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
}

export default MarketInfoProvider
