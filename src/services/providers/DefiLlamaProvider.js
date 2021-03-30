import axios from 'axios'

class DefiLlamaProvider {
  baseUrl = 'https://api.defillama.com'

  async getGlobalDefiMarkets() {
    const { data } = await axios.get(`${this.baseUrl}/charts`)
    const lastItem = data.pop()

    return {
      totalValueLocked: lastItem.totalLiquidityUSD,
      volume24h: lastItem.dailyVolumeUSD
    }
  }

  getDefiMarkets() {
    return this.doGetRequest(`${this.baseUrl}/protocols`)
  }
}

export default DefiLlamaProvider
