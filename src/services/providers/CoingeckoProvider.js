import axios from 'axios'

class CoingeckoProvider {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3'
  }

  async getGlobalDefiMarkets() {
    const { data: resp } = await axios.get(`${this.baseUrl}/global/decentralized_finance_defi`)

    return {
      marketCapDefi: resp.data.defi_market_cap,
      volume24hDefi: resp.data.trading_volume_24h
    }
  }

  async getGlobalMarkets() {
    const { data: resp } = await axios.get(`${this.baseUrl}/global`)

    return {
      marketCap: resp.data.total_market_cap.usd,
      volume24h: resp.data.total_volume.usd,
      dominanceBTC: resp.data.market_cap_percentage.btc
    }
  }
}

export default CoingeckoProvider
