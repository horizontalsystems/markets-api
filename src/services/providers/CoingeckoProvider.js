import axios from 'axios'

class CoingeckoProvider {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3'
    this.Responsetimeout = 180000
    axios.defaults.timeout = 180000;
  }

  async getGlobalDefiMarkets() {
    const { data: resp } = await axios.get(
      `${this.baseUrl}/global/decentralized_finance_defi`,
      { timeout: this.Responsetimeout }
    )

    return {
      marketCapDefi: resp.data.defi_market_cap,
      volume24hDefi: resp.data.trading_volume_24h
    }
  }

  async getXRates(coins, fiats) {
    const params = `ids=${coins}&vs_currencies=${fiats}&include_market_cap=false`
    const { data: resp } = await axios.get(
      `${this.baseUrl}/simple/price?${params}`,
      { timeout: this.Responsetimeout }
    )

    return resp
  }

  async getGlobalMarkets() {
    const { data: resp } = await axios.get(`${this.baseUrl}/global`, { timeout: this.Responsetimeout })

    return {
      marketCap: resp.data.total_market_cap.usd,
      volume24h: resp.data.total_volume.usd,
      dominanceBTC: resp.data.market_cap_percentage.btc
    }
  }
}

export default CoingeckoProvider
