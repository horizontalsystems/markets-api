import Sequelize from 'sequelize'
import configJson from '../db/config.json'
import GlobalMarkets from './GlobalMarkets'

const config = configJson[process.env.NODE_ENV || 'development']
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

const models = {
  GlobalMarkets: GlobalMarkets.init(sequelize, Sequelize)
}

// This creates relationships in the ORM
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models))

export default {
  ...models,
  sequelize
}
