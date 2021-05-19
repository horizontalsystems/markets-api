import Sequelize from 'sequelize'

class TokenInfo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        tokenAddress: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        timestamp: {
          type: DataTypes.BIGINT
        }
      },
      {
        timestamps: false,
        tableName: 'tb_token_info',
        sequelize
      }
    )
  }

  static associate(models) {
    TokenInfo.hasMany(models.TokenHolder, {
      as: 'tokenHolders',
      foreignKey: {
        name: 'token_info_id',
        fieldName: 'tokenInfoId'
      },
      onDelete: 'cascade'
    });
  }
}

export default TokenInfo
