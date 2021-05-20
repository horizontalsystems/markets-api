import Storage from '../db/Storage'
import logger from '../logger'

const DATA_LIFE_TIME = 1200 // 15 mins
const MAX_HOLDERS_TO_STORE = 50

class TokenInfoService {
  constructor(tokenInfoProvider) {
    this.tokenInfoProvider = tokenInfoProvider
  }

  async getTopTokenHolders(tokenAddressParam, limit) {
    try {
      const tokenAddress = tokenAddressParam.toLowerCase()
      const now = Math.floor(Date.now() / 1000)
      const tokenInfo = await Storage.getTokenHolders(tokenAddress, now - DATA_LIFE_TIME)

      if (tokenInfo) {
        return tokenInfo.tokenHolders.slice(0, limit).map(item => ({
          address: item.address,
          balance: parseInt(item.balance, 10),
          share: item.share
        }))
      }

      const holders = await this.tokenInfoProvider.getTopTokenHolders(tokenAddress, MAX_HOLDERS_TO_STORE)

      if (holders.length > 0) {
        await Storage.removeTokenHolders(tokenAddress)
        const tokenData = {
          tokenAddress,
          timestamp: now,
          tokenHolders: holders
        }
        Storage.saveTokenHolders(tokenData)

        return holders.slice(0, limit)
      }
    } catch (e) {
      logger.error(`Error getting top holders: ${e}`)
    }

    return []
  }
}

export default TokenInfoService
