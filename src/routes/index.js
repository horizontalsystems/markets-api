/* eslint-disable no-unused-vars */
import marketsRoutes from './markets.routes'

export default app => {
  // Routes
  app.use('/api/v1/markets', marketsRoutes)

  // Error handling
  app.use((err, req, res, next) => {
    res.status(500)
    res.send(err.message)
  })
}
