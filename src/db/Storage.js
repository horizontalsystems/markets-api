import Sequelize from 'sequelize'
import models from '../models'
import GlobalMarkets from '../models/GlobalMarkets'
import CoinInfo from '../models/CoinInfo'
import ResourceInfo from '../models/ResourceInfo'
import XRate from '../models/XRate'

export default {
  saveXRates(rates) {
    return XRate.bulkCreate(rates, {
      ignoreDuplicates: true
    })
  },

  getXRate(timestamp, sourceCurrencyCode, targetCurrencyCode) {
    return XRate.findOne({
      where: {
        timestamp,
        sourceCode: sourceCurrencyCode,
        targetCode: targetCurrencyCode
      },
      attributes: ['rate']
    })
  },

  getXRates(timestamps, sourceCurrencyCode, targetCurrencyCode) {
    return XRate.findAll({
      order: [['timestamp', 'DESC']],
      where: {
        timestamp: {
          [Sequelize.Op.in]: timestamps
        },
        sourceCode: sourceCurrencyCode,
        targetCode: targetCurrencyCode
      },
      attributes: ['timestamp', 'rate']
    })
  },

  saveGlobalMarkets(data) {
    GlobalMarkets.create({
      timestamp: data.timestamp,
      marketCap: data.marketCap,
      marketCapDefi: data.marketCapDefi,
      dominanceBTC: data.dominanceBTC,
      volume24h: data.volume24h,
      totalValueLocked: data.totalValueLocked
    })
  },

  getGlobalMarkets(fromTimestamp) {
    return GlobalMarkets.findAll({
      order: [['timestamp', 'DESC']],
      where: {
        timestamp: {
          [Sequelize.Op.gte]: fromTimestamp
        }
      },
      attributes: ['timestamp', 'marketCap', 'marketCapDefi', 'dominanceBTC', 'volume24h', 'totalValueLocked']
    })
  },

  async saveResourceInfo(newItem) {
    const foundItem = await ResourceInfo.findOne({ where: { name: newItem.name } });
    if (!foundItem) {
      const item = await ResourceInfo.create(newItem)
      return item;
    }
    const item = await ResourceInfo.update(newItem, { where: { name: newItem.name } });
    return item;
  },

  getResourceInfo(name) {
    return ResourceInfo.findOne({ where: { name } });
  },

  saveCoinInfoDetails(coins) {
    return CoinInfo.bulkCreate(coins, {
      include: ['defiMarkets'],
      ignoreDuplicates: true
    })
  },

  updateCoinInfos(coinInfos) {
    return CoinInfo.bulkCreate(coinInfos, {
      updateOnDuplicate: ['name', 'code', 'defillamaId', 'coinGeckoId', 'status', 'imageUrl']
    })
  },

  async getDefiMarkets(fromTimestamp) {
    const sql = `SELECT DISTINCT ON (tb1.coin_id) tb1.coin_id,
                    tbc.coingecko_id, tbc.code, tbc.name, tbc.image_url, tb1.tvl, tb1.timestamp,
                    CASE WHEN tb2.tvl <=0 THEN 0
                     ELSE ((tb1.tvl-tb2.tvl)* 100)/tb2.tvl
                    END AS tvl_diff
                 FROM tb_defi_markets tb1,
                      tb_coin_info tbc,
                      (SELECT DISTINCT ON (coin_id) coin_id,tvl, timestamp FROM tb_defi_markets
                       WHERE timestamp>=:fromTimestamp order by coin_id, timestamp) tb2
                 WHERE tb2.coin_id = tb1.coin_id and tbc.id = tb2.coin_id
                 ORDER BY tb1.coin_id, tb1.timestamp DESC`

    const defiMarkets = await models.sequelize.query(sql, {
      replacements: { fromTimestamp },
      type: Sequelize.QueryTypes.SELECT
    });

    return defiMarkets
  }
}
