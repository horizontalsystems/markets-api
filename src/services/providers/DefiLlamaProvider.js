import axios from 'axios'

class DefiLlamaProvider {
  constructor() {
    this.baseUrl = 'https://api.llama.fi'
    this.Responsetimeout = 180000
    axios.defaults.timeout = 180000;
  }

  async getGlobalDefiMarkets() {
    const { data } = await axios.get(`${this.baseUrl}/charts`, { timeout: this.Responsetimeout })

    const lastItem = data.pop()

    return {
      totalValueLocked: lastItem.totalLiquidityUSD
    }
  }

  getDefiMarkets() {
    return axios.get(`${this.baseUrl}/protocols`, { timeout: this.Responsetimeout })
  }
}

export default DefiLlamaProvider
