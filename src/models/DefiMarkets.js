import Sequelize from 'sequelize'

class DefiMarkets extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
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
        tableName: 'tb_defi_markets',
        sequelize
      }
    )
  }

  static associate(models) {
    DefiMarkets.belongsTo(models.CoinInfo, {
      as: 'coinInfo',
      foreignKey: {
        name: 'coin_id',
        fieldName: 'coinId'
      }
    });
  }
}

export default DefiMarkets
