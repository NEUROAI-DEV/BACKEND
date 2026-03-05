import type { WebSocket } from 'ws'
import logger from '../../logs'
import { SAMPLE_WELCOME, SAMPLE_TICK, buildEcho } from './sampleData'

export class WebSocketHandler {
  private static sendJson(ws: WebSocket, data: object): void {
    if (ws.readyState !== ws.OPEN) return
    try {
      ws.send(JSON.stringify(data))
    } catch (err) {
      logger.error('[WebSocket] send error:', err)
    }
  }

  private static handleMessage(ws: WebSocket, raw: string): void {
    let payload: unknown
    try {
      payload = raw ? JSON.parse(raw) : null
    } catch {
      payload = raw
    }

    if (payload !== null && typeof payload === 'object' && 'type' in payload) {
      const msg = payload as { type: string }
      if (msg.type === 'ping') {
        WebSocketHandler.sendJson(ws, {
          type: 'pong',
          timestamp: new Date().toISOString()
        })
        return
      }
    }

    WebSocketHandler.sendJson(ws, buildEcho(payload))
    WebSocketHandler.sendJson(ws, {
      ...SAMPLE_TICK,
      timestamp: new Date().toISOString()
    })
  }

  static attach(ws: WebSocket): void {
    const welcome = {
      ...SAMPLE_WELCOME,
      timestamp: new Date().toISOString()
    }
    WebSocketHandler.sendJson(ws, welcome)

    ws.on('message', (data: Buffer | string) => {
      const raw = typeof data === 'string' ? data : data.toString('utf8')
      WebSocketHandler.handleMessage(ws, raw)
    })

    ws.on('close', () => {
      logger.info('[WebSocket] Client disconnected')
    })

    ws.on('error', (err) => {
      logger.error('[WebSocket] Client error:', err)
    })
  }
}
