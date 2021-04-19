import Sequelize from 'sequelize'

class CoinInfo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING
        },
        code: {
          type: DataTypes.STRING
        },
        address: {
          type: DataTypes.STRING
        },
        imageUrl: {
          type: DataTypes.STRING,
          field: 'image_url'
        },
        defillamaId: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          field: 'defillama_id'
        },
        coinGeckoId: {
          type: DataTypes.STRING,
          field: 'coingecko_id'
        },
        status: {
          type: DataTypes.INTEGER, defaultValue: 1
        }
      },
      {
        timestamps: false,
        tableName: 'tb_coin_info',
        sequelize
      }
    )
  }

  static associate(models) {
    CoinInfo.hasMany(models.DefiMarkets, {
      as: 'defiMarkets',
      foreignKey: {
        name: 'coin_id',
        fieldName: 'coinId'
      }
    });
  }
}

export default CoinInfo
