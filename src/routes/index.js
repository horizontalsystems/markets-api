/* eslint-disable no-unused-vars */
import marketsRoutes from './markets.routes'
import cryptoNewsRoutes from './crypto.news.routes'

export default app => {
  // Routes
  app.use('/api/v1/markets', marketsRoutes)
  app.use('/api/v1/news/', cryptoNewsRoutes)

  // Error handling
  app.use((err, req, res, next) => {
    res.status(500)
    res.send(err.message)
  })
}
