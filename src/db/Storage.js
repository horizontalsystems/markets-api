import { Op } from 'sequelize'
import GlobalMarkets from '../models/GlobalMarkets'

export default {
  saveGlobalMarkets(data) {
    const now = Math.floor(Date.now() / 1000)

    GlobalMarkets.create({
      date: now,
      marketCap: data.marketCap,
      volume24h: data.volume24h,
      totalValueLocked: data.totalValueLocked
    })
  },

  getLatestMarkets() {
    const now = Math.floor(Date.now() / 1000)

    return GlobalMarkets.findAll({
      limit: 1,
      order: [['date', 'DESC']],
      where: {
        date: {
          [Op.lte]: now
        }
      },
      attributes: ['date', 'marketCap', 'volume24h', 'totalValueLocked']
    })
  }
}
