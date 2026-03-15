/**
 * Sample data for WebSocket testing.
 */

const BASE_PRICE = 43250.5

export const SAMPLE_TICK = {
  type: 'tick',
  symbol: 'BTCUSDT',
  price: BASE_PRICE,
  timestamp: new Date().toISOString()
}

/** Generate a tick with slight price variation for realtime demo. */
export function buildRealtimeTick(): typeof SAMPLE_TICK & { price: number } {
  const variation = (Math.random() - 0.5) * 100
  return {
    type: 'tick',
    symbol: 'BTCUSDT',
    price: Math.round((BASE_PRICE + variation) * 100) / 100,
    timestamp: new Date().toISOString()
  }
}

export const SAMPLE_WELCOME = {
  type: 'welcome',
  message: 'Connected to NEUROAI WebSocket',
  version: '1.0',
  timestamp: new Date().toISOString()
}

export function buildEcho(payload: unknown): {
  type: string
  received: unknown
  timestamp: string
} {
  return {
    type: 'echo',
    received: payload,
    timestamp: new Date().toISOString()
  }
}
