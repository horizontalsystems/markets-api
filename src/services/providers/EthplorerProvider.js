import axios from 'axios'

const MAX_HOLDERS_LIMIT = 100

class EthplorerProvider {
  constructor() {
    this.baseUrl = 'https://api.ethplorer.io'
    this.apiKey = process.env.ETHPLORER_API_KEY
    this.Responsetimeout = 180000
    axios.defaults.timeout = 180000;
  }

  async getTopTokenHolders(tokenAddress, limit) {
    const params = `apiKey=${this.apiKey}&limit=${limit > MAX_HOLDERS_LIMIT ? MAX_HOLDERS_LIMIT : limit}`
    const response = await axios.get(
      `${this.baseUrl}/getTopTokenHolders/${tokenAddress}?${params}`,
      { timeout: this.Responsetimeout }
    )

    if (response.status === 200) {
      return response.data.holders
    }

    if (response.error) {
      return { error: 'Invalid token address' }
    }

    return []
  }
}

export default EthplorerProvider
