class MarketInfoProvider {
  constructor(coingeckoProvider, defiLlamaProvider) {
    this.coingeckoProvider = coingeckoProvider
    this.defiLlamaProvider = defiLlamaProvider
  }

  async getGlobalMarkets() {
    const globalData = await this.coingeckoProvider.getGlobalDefiMarkets()

    if (globalData) {
      const defiLlamaData = await this.defiLlamaProvider.getGlobalDefiMarkets()
      globalData.totalValueLocked = defiLlamaData.totalValueLocked
      globalData.volume24h = defiLlamaData.volume24h
      return globalData
    }

    return {}
  }
}

export default MarketInfoProvider
