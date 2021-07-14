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
          type: DataTypes.STRING(50)
        },
        code: {
          type: DataTypes.STRING(25)
        },
        address: {
          type: DataTypes.STRING(120)
        },
        chain: {
          type: DataTypes.STRING(30)
        },
        chains: {
          type: DataTypes.STRING(120)
        },
        imageUrl: {
          type: DataTypes.STRING(400),
          field: 'image_url'
        },
        coinGeckoId: {
          type: DataTypes.STRING(70),
          field: 'coingecko_id'
        },
        status: {
          type: DataTypes.INTEGER, defaultValue: 1
        },
        tvlRank: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          field: 'tvl_rank'
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

    CoinInfo.hasMany(models.ChainDefiMarkets, {
      as: 'chainDefiMarkets',
      foreignKey: {
        name: 'coin_id',
        fieldName: 'coinId'
      }
    });
  }
}

export default CoinInfo
