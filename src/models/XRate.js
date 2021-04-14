import Sequelize from 'sequelize';

class FiatXRate extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        timestamp: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        sourceCode: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'source_code',
          primaryKey: true
        },
        targetCode: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'target_code',
          primaryKey: true
        },
        rate: {
          type: DataTypes.DOUBLE,
          defaultValue: 0
        }
      },
      {
        timestamps: false,
        tableName: 'tb_xrate',
        sequelize
      }
    );
  }
}

export default FiatXRate;
