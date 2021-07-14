import axios from 'axios'

class DefiLlamaProvider {
  constructor() {
    this.baseUrl = 'https://api.llama.fi'
    this.Responsetimeout = 280000
    axios.defaults.timeout = 280000;
  }

  async getGlobalDefiMarkets() {
    try {
      const { data } = await axios.get(`${this.baseUrl}/charts`, { timeout: this.Responsetimeout })

      const lastItem = data.pop()
      return {
        totalValueLocked: lastItem.totalLiquidityUSD
      }
    } catch (e) {
      console.log(e)
    }

    return {}
  }

  getDefiMarkets() {
    return axios.get(`${this.baseUrl}/protocols`, { timeout: this.Responsetimeout })
  }
}

export default DefiLlamaProvider
