import Sequelize from 'sequelize'

class GlobalMarkets extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
        {
          id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          date: {
            type: DataTypes.BIGINT,
            allowNull: false
          },
          marketCap: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            field: 'market_cap'
          },
          marketCapDefi: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            field: 'market_cap_defi'
          },
          dominanceBTC: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            field: 'dominance_btc'
          },
          volume24h: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
          },
          totalValueLocked: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            field: 'tvl'
          }
        },
        {
          timestamps: false,
          tableName: 'global_markets',
          sequelize
        }
    )
  }
}

export default GlobalMarkets
