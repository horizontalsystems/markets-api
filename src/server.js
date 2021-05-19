import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import xss from 'xss-clean'
import cors from 'cors'
import AppRoutes from './routes/AppRoutes'
import logger from './logger'

class Server {
  constructor(marketsService, tokenInfoService) {
    this.marketsService = marketsService
    this.tokenInfoService = tokenInfoService

    this.server = express()

    // set security HTTP headers
    this.server.use(helmet())

    // parse json request body
    this.server.use(express.json())

    // parse urlencoded request body
    this.server.use(express.urlencoded({ extended: true }))

    // sanitize request data
    this.server.use(xss())

    // gzip compression
    this.server.use(compression())

    // enable cors
    this.server.use(cors())
    this.server.options('*', cors())
    const appRoutes = new AppRoutes(this.marketsService, this.tokenInfoService)
    this.server.use(appRoutes.getRouter())
  }

  start() {
    this.server.listen(process.env.PORT, () => {
      logger.info(`Server started at port ${process.env.PORT}`)
    })
  }
}

export default Server
