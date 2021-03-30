import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import xss from 'xss-clean'
import cors from 'cors'
import routes from './routes'

const server = express()

// set security HTTP headers
server.use(helmet())

// parse json request body
server.use(bodyParser.json())

// parse urlencoded request body
server.use(bodyParser.urlencoded({ extended: true }))

// sanitize request data
server.use(xss())

// gzip compression
server.use(compression())

// enable cors
server.use(cors())
server.options('*', cors())

// API routes
routes(server)

export default server
