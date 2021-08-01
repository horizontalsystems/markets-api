import Sequelize from 'sequelize'
import models from '../models'
import GlobalMarkets from '../models/GlobalMarkets'
import CoinInfo from '../models/CoinInfo'
import ResourceInfo from '../models/ResourceInfo'
import XRate from '../models/XRate'
import TokenInfo from '../models/TokenInfo'
import DefiMarketsCache from '../models/DefiMarketsCache'

export default {
  saveXRates(rates) {
    return XRate.bulkCreate(rates, {
      ignoreDuplicates: true
    })
  },

  deleteDefiMarketsCache() {
    return DefiMarketsCache.destroy({
      where: {},
      truncate: true
    })
  },

  saveDefiMarketsCache(cacheData) {
    return DefiMarketsCache.bulkCreate(cacheData, {
      ignoreDuplicates: true
    })
  },

  async getDefiMarketsCache(timePeriod, chain) {
    const sql = `SELECT *
                  FROM tb_defi_markets_cache
                  WHERE time_period = :timePeriod AND
                        chain=:chain`

    const defiMarketsCacheDataCount = await models.sequelize.query(sql, {
      replacements: { timePeriod, chain },
      type: Sequelize.QueryTypes.SELECT
    });

    return defiMarketsCacheDataCount
  },

  async getDefiMarketsCacheDataCount(timePeriod, chain) {
    const sql = `SELECT count(*)
                  FROM tb_defi_markets_cache
                  WHERE time_period = :timePeriod AND
                        chain=:chain`

    const defiMarketsCacheDataCount = await models.sequelize.query(sql, {
      replacements: { timePeriod, chain },
      type: Sequelize.QueryTypes.SELECT
    });

    return defiMarketsCacheDataCount
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
      order: [['timestamp', 'ASC']],
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
      updateOnDuplicate: ['coinGeckoId', 'code', 'name', 'imageUrl', 'chain', 'tvlRank'],
      include: ['defiMarkets', 'chainDefiMarkets']
    })
  },

  updateCoinInfo(coinId, coinInfo) {
    return CoinInfo.findOne({
      where: {
        id: coinId
      }
    }).then(found => {
      if (found) {
        return found.update(coinInfo);
      }
      return CoinInfo.create(coinInfo);
    })
  },

  async getCoinsInfo() {
    const sql = `SELECT *
                  FROM tb_coin_info
                  WHERE status = 1 AND
                        tvl_rank<>0
                  ORDER BY tvl_rank`

    const defiMarkets = await models.sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT
    });

    return defiMarkets
  },

  async getDefiMarketsByCoin(coinGeckoId, fromTimestamp) {
    const sql = `SELECT *
                 from tb_coin_info tbc, tb_defi_markets tbm
                 WHERE tbm.coin_id = tbc.id and tbm.timestamp>=:fromTimestamp
                       AND tbc.coingecko_id=:coinGeckoId
                 ORDER BY tbm.timestamp ASC`

    const defiMarkets = await models.sequelize.query(sql, {
      replacements: { fromTimestamp, coinGeckoId },
      type: Sequelize.QueryTypes.SELECT
    });

    return defiMarkets
  },

  async getLatestCoinDefiMarkets(coinGeckoId) {
    const sql = `SELECT DISTINCT ON (tbc.id) tbc.id, tbc.*, tbf.*
                  FROM tb_coin_info tbc, tb_defi_markets tbf
                  WHERE tbf.coin_id = tbc.id AND
                        tbc.coingecko_id=:coinGeckoId
                  ORDER BY tbc.id, tbf.timestamp DESC`

    const coinDefiMarkets = await models.sequelize.query(sql, {
      replacements: { coinGeckoId },
      type: Sequelize.QueryTypes.SELECT
    });

    return coinDefiMarkets
  },

  async getDefiMarketsDiff(fromTimestamp, coinIds) {
    const sql = `SELECT DISTINCT ON (tb1.coin_id) tb1.coin_id,
                    tb1.timestamp, tb1.tvl,
                    CASE WHEN tb2.tvl <=0 THEN 0
                     ELSE ((tb1.tvl-tb2.tvl)* 100)/tb2.tvl
                    END AS tvl_diff
                 FROM tb_defi_markets tb1,
                      (SELECT DISTINCT ON (coin_id) coin_id, tvl, timestamp
                       FROM tb_defi_markets
                       WHERE timestamp>=:fromTimestamp AND
                             coin_id IN (:coinIds)
                       ORDER BY coin_id, timestamp) tb2
                 WHERE tb2.coin_id = tb1.coin_id
                 ORDER BY tb1.coin_id, tb1.timestamp DESC`

    const defiMarkets = await models.sequelize.query(sql, {
      replacements: { fromTimestamp, coinIds },
      type: Sequelize.QueryTypes.SELECT
    });

    return defiMarkets
  },

  async getChainDefiMarketsDiff(fromTimestamp, chainFilter, coinIds) {
    const sql = `SELECT DISTINCT ON (tb1.coin_id) tb1.coin_id,
                        tb1.timestamp, tb1.tvl,
                        CASE WHEN tb2.tvl <=0 THEN 0
                            ELSE ((tb1.tvl-tb2.tvl)* 100)/tb2.tvl
                        END AS tvl_diff
                 FROM tb_chain_defi_markets tb1,
                      ( SELECT DISTINCT ON (coin_id) coin_id,tvl, timestamp
                        FROM tb_chain_defi_markets
                        WHERE timestamp>=:fromTimestamp AND
                              chain=:chainFilter AND
                              coin_id IN (:coinIds)
                        ORDER BY coin_id, timestamp
                      ) tb2
                 WHERE tb2.coin_id = tb1.coin_id AND
                      chain=:chainFilter
                 ORDER BY tb1.coin_id, tb1.timestamp DESC`

    const defiMarkets = await models.sequelize.query(sql, {
      replacements: { fromTimestamp, chainFilter, coinIds },
      type: Sequelize.QueryTypes.SELECT
    });

    return defiMarkets
  },

  getTokenHolders(tokenAddress, timestamp) {
    return TokenInfo.findOne({
      include: ['tokenHolders'],
      where: {
        tokenAddress,
        timestamp: {
          [Sequelize.Op.gte]: timestamp
        }
      },
      order: [['tokenHolders', 'share', 'DESC']]
    })
  },

  removeTokenHolders(tokenAddress) {
    return TokenInfo.destroy({
      where: {
        tokenAddress
      }
    });
  },

  saveTokenHolders(tokenInfo) {
    return TokenInfo.create(tokenInfo, {
      include: ['tokenHolders']
    })
  }
}
