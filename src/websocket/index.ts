import { WebSocketServer } from 'ws'
import type { Server } from 'http'
import logger from '../../logs'
import { WebSocketHandler } from './WebSocketHandler'
import { buildRealtimeTick } from './sampleData'

const REALTIME_INTERVAL_MS = 2000

export class WebSocketServerManager {
  public readonly wss: WebSocketServer
  private intervalId: ReturnType<typeof setInterval> | null = null

  constructor(httpServer: Server) {
    this.wss = new WebSocketServer({ server: httpServer })

    this.wss.on('connection', (ws) => {
      logger.info('[WebSocket] Client connected')
      WebSocketHandler.attach(ws)
    })

    this.wss.on('error', (err) => {
      logger.error('[WebSocket] Server error:', err)
    })

    logger.info('[WebSocket] Server attached to HTTP server')
  }

  private broadcastRealtimeTick(): void {
    const payload = buildRealtimeTick()
    const raw = JSON.stringify(payload)
    let sent = 0

    this.wss.clients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        try {
          ws.send(raw)
          sent++
        } catch (err) {
          logger.error('[WebSocket] broadcast error:', err)
        }
      }
    })

    if (sent > 0) {
      logger.debug(`[WebSocket] Realtime tick broadcast to ${sent} client(s)`)
    }
  }

  startRealtime(): void {
    if (this.intervalId != null) return
    this.intervalId = setInterval(() => {
      this.broadcastRealtimeTick()
    }, REALTIME_INTERVAL_MS)
    logger.info(`[WebSocket] Realtime tick every ${REALTIME_INTERVAL_MS / 1000}s`)
  }

  stopRealtime(): void {
    if (this.intervalId == null) return
    clearInterval(this.intervalId)
    this.intervalId = null
    logger.info('[WebSocket] Realtime broadcast stopped')
  }
}

export function createWebSocketServer(httpServer: Server): WebSocketServerManager {
  const manager = new WebSocketServerManager(httpServer)
  manager.startRealtime()
  return manager
}

export { WebSocketHandler } from './WebSocketHandler'
export * from './sampleData'
