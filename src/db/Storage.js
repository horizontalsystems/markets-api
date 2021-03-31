import { Op } from 'sequelize'
import GlobalMarkets from '../models/GlobalMarkets'

export default {
  saveGlobalMarkets(data) {
    const now = Math.floor(Date.now() / 1000)

    GlobalMarkets.create({
      timestamp: now,
      marketCap: data.marketCap,
      marketCapDefi: data.marketCapDefi,
      dominanceBTC: data.dominanceBTC,
      volume24h: data.volume24h,
      totalValueLocked: data.totalValueLocked
    })
  },

  getGlobalMarkets(toTimestamp) {
    return GlobalMarkets.findAll({
      order: [['timestamp', 'DESC']],
      where: {
        timestamp: {
          [Op.gte]: toTimestamp
        }
      },
      attributes: ['timestamp', 'marketCap', 'marketCapDefi', 'dominanceBTC', 'volume24h', 'totalValueLocked']
    })
  }

}
