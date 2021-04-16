import Storage from '../db/Storage'
import logger from '../logger'

class CryptoNewsService {
  async getLatestNews() {
    try {
      const resp = await Storage.getCryptoNews()

      return {
        timestamp: resp.timestamp,
        guid: resp.guid,
        title: resp.title,
        body: resp.body,
        url: resp.url,
        source: resp.source
      }
    } catch (e) {
      logger.error(`Error getting latest News ${e}`)
    }

    return {}
  }
}

export default CryptoNewsService
