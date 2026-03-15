import http from 'http'
import app from './src/app'
import { appConfigs } from './src/configs'
import logger from './logs'
import { createWebSocketServer } from './src/websocket'

const PORT = appConfigs.app.port || 8000

const httpServer = http.createServer(app)
const wsManager = createWebSocketServer(httpServer)

httpServer.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.')
  wsManager.stopRealtime()
  wsManager.wss.close(() => {
    logger.info('WebSocket server closed.')
  })
  httpServer.close(() => {
    logger.info('HTTP server closed.')
  })
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason)
})
