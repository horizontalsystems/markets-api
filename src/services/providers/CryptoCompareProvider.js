import axios from 'axios'

class CryptoCompareProvider {
  constructor() {
    this.baseUrl = 'https://min-api.cryptocompare.com/data/v2'
  }

  async getLatestNews() {
    const { data: resp } = await axios.get(`${this.baseUrl}/news/?feeds=cointelegraph,theblock,decrypt`)

    return resp.Data
  }
}

export default CryptoCompareProvider
