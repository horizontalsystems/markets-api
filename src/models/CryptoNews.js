import Sequelize from 'sequelize'

class CryptoNews extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        guid: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        timestamp: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        title: {
          type: DataTypes.STRING
        },
        body: {
          type: DataTypes.TEXT
        },
        source: {
          type: DataTypes.STRING
        },
        url: {
          type: DataTypes.STRING
        }
      },
      {
        timestamps: false,
        tableName: 'tb_crypto_news',
        sequelize
      }
    )
  }
}

export default CryptoNews
