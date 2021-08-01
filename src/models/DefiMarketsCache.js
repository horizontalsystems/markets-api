import Sequelize from 'sequelize'

class DefiMarketsCache extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        timePeriod: {
          type: DataTypes.STRING,
          primaryKey: true,
          field: 'time_period'
        },
        coinId: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          field: 'coin_id'
        },
        chain: {
          type: DataTypes.STRING,
          primaryKey: true,
          defaultValue: 'all',
          field: 'chain'
        },
        timestamp: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        totalValueLocked: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
          field: 'tvl'
        },
        totalValueLockedDiff: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
          field: 'tvl_diff'
        }
      },
      {
        timestamps: false,
        tableName: 'tb_defi_markets_cache',
        sequelize
      }
    )
  }
}

export default DefiMarketsCache
