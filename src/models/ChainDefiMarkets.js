import Sequelize from 'sequelize'

class ChainDefiMarkets extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        chain: {
          type: DataTypes.STRING,
          allowNull: false
        },
        timestamp: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        totalValueLocked: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
          field: 'tvl'
        }
      },
      {
        timestamps: false,
        tableName: 'tb_chain_defi_markets',
        sequelize
      }
    )
  }

  static associate(models) {
    ChainDefiMarkets.belongsTo(models.CoinInfo, {
      as: 'coinInfo',
      foreignKey: {
        name: 'coin_id',
        fieldName: 'coinId'
      }
    });
  }
}

export default ChainDefiMarkets
