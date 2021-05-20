import Sequelize from 'sequelize'

class TokenHolder extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false
        },
        balance: {
          type: DataTypes.BIGINT,
          defaultValue: 0
        },
        share: {
          type: DataTypes.DOUBLE,
          defaultValue: 0
        }
      },
      {
        timestamps: false,
        tableName: 'tb_token_holder',
        sequelize
      }
    )
  }

  static associate(models) {
    TokenHolder.belongsTo(models.TokenInfo, {
      as: 'tokenInfo',
      foreignKey: {
        name: 'token_info_id',
        fieldName: 'tokenInfoId'
      }
    });
  }
}

export default TokenHolder
