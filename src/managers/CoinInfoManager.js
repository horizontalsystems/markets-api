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
        const coinInfos = []

        coinsInfo.coins.forEach(coin => {
          let status = 0

          if (Object.keys(coin.coingecko_id).length > 0) {
            status = 1
          }

          const coinInfo = {
            id: coin.id,
            name: coin.name,
            code: coin.code,
            address: coin.address,
            defillamaId: coin.name.toLowerCase().trim().replace(/ /g, '-'),
            coinGeckoId: coin.coingecko_id,
            status
          }
          coinInfos.push(coinInfo)
        })
        Storage.updateCoinInfos(coinInfos)
        Storage.saveResourceInfo({ name: ResourceType.COININFO, version })
      }
    } catch (e) {
      logger.log(e)
    }
  }
}

export default CoinInfoManager
