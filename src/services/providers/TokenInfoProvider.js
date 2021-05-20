import logger from '../../logger'

class TokenInfoProvider {
  constructor(ethplorerProvider) {
    this.ethplorerProvider = ethplorerProvider
  }

  getTopTokenHolders(tokenAddress, limit) {
    try {
      return this.ethplorerProvider.getTopTokenHolders(tokenAddress, limit)
    } catch (e) {
      logger.error(`Error fetching holders: ${e}`)
    }

    return []
  }
}

export default TokenInfoProvider
