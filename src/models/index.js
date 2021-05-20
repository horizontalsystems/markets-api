import Sequelize from 'sequelize'
import configJson from '../db/config.json'
import GlobalMarkets from './GlobalMarkets'
import CoinInfo from './CoinInfo'
import DefiMarkets from './DefiMarkets'
import ResourceInfo from './ResourceInfo'
import FiatXRate from './XRate'
import TokenInfo from './TokenInfo'
import TokenHolder from './TokenHolder'

const config = configJson[process.env.NODE_ENV || 'development']
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

const models = {
  GlobalMarkets: GlobalMarkets.init(sequelize, Sequelize),
  DefiMarkets: DefiMarkets.init(sequelize, Sequelize),
  ResourceInfo: ResourceInfo.init(sequelize, Sequelize),
  CoinInfo: CoinInfo.init(sequelize, Sequelize),
  FiatXRate: FiatXRate.init(sequelize, Sequelize),
  TokenInfo: TokenInfo.init(sequelize, Sequelize),
  TokenHolder: TokenHolder.init(sequelize, Sequelize)
}

// This creates relationships in the ORM
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models))

export default {
  ...models,
  sequelize
}
