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
      updateOnDuplicate: ['name', 'code', 'defillamaId', 'coinGeckoId', 'status']
    })
  },

  async getDefiMarkets(fromTimestamp) {
    const sql = `SELECT DISTINCT ON (coin_id) tb1.coin_id,
                                tbc.coingecko_id,tbc.code,tbc.name, tb1.timestamp,
                                tb1.tvl as totalValueLocked,
                                case when tb1.tvl <=0 then 0
                                else ((tb2.tvl-tb1.tvl)* 100)/tb1.tvl end AS totalValueLockedDiff24h
                 FROM tb_defi_markets AS tb1, tb_defi_markets AS tb2, tb_coin_info AS tbc
                 WHERE tb1.coin_id = tb2.coin_id and tb2.timestamp>=:fromTimestamp and tbc.id = tb1.coin_id
                 ORDER BY tb1.coin_id, tb1.timestamp DESC, tb2.timestamp`

    const defiMarkets = await models.sequelize.query(sql, {
      replacements: { fromTimestamp },
      type: Sequelize.QueryTypes.SELECT
    });

    return defiMarkets
  }
}
