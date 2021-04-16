import cron from 'node-cron'
import Storage from '../db/Storage'
import logger from '../logger'

const EVERY_15M = '0 */15 * * * *' // every 15 min

class CryptoNewsSyncer {
  constructor(cryptoNewsProvider) {
    this.cryptoNewsProvider = cryptoNewsProvider
  }

  start() {
    try {
      cron.schedule(EVERY_15M, this.syncCryptoNews.bind(this))
    } catch (e) {
      logger.error(e.stack)
    }
  }

  syncCryptoNews() {
    this.cryptoNewsProvider.getLatestNews().then(data => {
      Storage.saveCryptoNews(data).catch(
        e => logger.error(`Error when saving cryptoNews: ${e.stack}`)
      );
    }).catch(e => logger.error(`Error fetching cryptoNews: ${e}`));
  }
}

export default CryptoNewsSyncer
