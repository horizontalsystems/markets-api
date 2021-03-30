import axios from 'axios'

class CoingeckoProvider {
  baseUrl = 'https://api.coingecko.com/api/v3'

  async getGlobalDefiMarkets() {
    const { data: resp } = await axios.get(`${this.baseUrl}/global/decentralized_finance_defi`)

    return {
      marketCap: resp.data.defi_market_cap,
      volume24h: resp.data.trading_volume_24h
    }
  }
}

export default CoingeckoProvider
