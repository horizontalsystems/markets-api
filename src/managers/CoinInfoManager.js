/* eslint-disable prefer-destructuring */
import Storage from '../db/Storage'
import ResourceType from '../models/ResourceType'
import coinsInfo from './coins.info.json'
import logger from '../logger'

class CoinInfoManager {
  async init() {
    let updateData = false
    const { version } = coinsInfo

    try {
      const resourceInfo = await Storage.getResourceInfo(ResourceType.COININFO)

      if (!resourceInfo) {
        updateData = true
      } else if (resourceInfo.version !== version) updateData = true

      if (updateData) {
        const promises = []

        coinsInfo.coins.forEach(coin => {
          let status = 0

          if (coin.coingecko_id) {
            if (Object.keys(coin.coingecko_id).length > 0) {
              status = 1
            }
          }

          const coinInfo = {
            id: coin.id,
            name: coin.name,
            code: coin.code,
            address: coin.address,
            chain: coin.chain,
            chains: coin.chains ? coin.chains.join(',').toLowerCase() : '',
            imageUrl: coin.image_url,
            coinGeckoId: coin.coingecko_id,
            status
          }
          promises.push(Storage.updateCoinInfo(coin.id, coinInfo))
        })

        Promise.all(promises).then(() => {
          Storage.saveResourceInfo({ name: ResourceType.COININFO, version })
        }).catch(e => {
          logger.error(`Error when updating CoinInfoManager : ${e}`)
        })
      }
    } catch (e) {
      logger.error(`Error in CoinInfoManager : ${e}`)
    }
  }
}

export default CoinInfoManager
