import logger from '../../logger'

class TokenInfoProvider {
  constructor(ethplorerProvider) {
    this.ethplorerProvider = ethplorerProvider
  }

  async getTopTokenHolders(tokenAddress, limit) {
    try {
      const responses = await this.ethplorerProvider.getTopTokenHolders(tokenAddress, limit)
      return responses.map(item => ({
        address: item.address,
        share: item.share
      }))
    } catch (e) {
      logger.error(`Error fetching holders: ${e}`)
    }

    return []
  }
}

export default TokenInfoProvider
