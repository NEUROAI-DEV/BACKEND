import axios from 'axios'
import { Op } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { SmartWalletModel } from '../models/smartWalletModel'
import { SmartWalletTrackerModel } from '../models/smartWalletTrackerModel'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? ''

export interface SmartWalletTx {
  from: string
  to: string
  value: string
  tokenSymbol: string
  tokenDecimal: string
}

export interface SmartWalletTokenFlow {
  token: string
  inflow: number
  outflow: number
  hold: number
}

export interface SmartWalletFlow {
  wallet: string
  tokens: SmartWalletTokenFlow[]
  totalInflow: number
  totalOutflow: number
  totalHold: number
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchTransactions(wallet: string): Promise<SmartWalletTx[]> {
  if (!ETHERSCAN_API_KEY) {
    throw new Error('ETHERSCAN_API_KEY is not set')
  }

  const res = await axios.get('https://api.etherscan.io/v2/api', {
    params: {
      chainid: 1,
      module: 'account',
      action: 'tokentx',
      address: wallet,
      page: 1,
      offset: 20,
      sort: 'desc',
      apikey: ETHERSCAN_API_KEY
    }
  })

  if (!Array.isArray(res.data.result)) {
    throw new Error(`Etherscan API Error: ${res.data.result}`)
  }

  return res.data.result as SmartWalletTx[]
}

function analyzeTransactions(wallet: string, txs: SmartWalletTx[]): SmartWalletFlow {
  const inflowMap: Record<string, number> = {}
  const outflowMap: Record<string, number> = {}

  for (const tx of txs) {
    if (!tx.from || !tx.to) continue

    const symbol = tx.tokenSymbol
    const decimals = Number(tx.tokenDecimal)
    const value = Number(tx.value) / Math.pow(10, decimals)

    if (!inflowMap[symbol]) inflowMap[symbol] = 0
    if (!outflowMap[symbol]) outflowMap[symbol] = 0

    const isInflow = tx.to.toLowerCase() === wallet.toLowerCase()
    const isOutflow = tx.from.toLowerCase() === wallet.toLowerCase()

    if (isInflow) inflowMap[symbol] += value
    if (isOutflow) outflowMap[symbol] += value
  }

  const tokens: SmartWalletTokenFlow[] = []
  let totalInflow = 0
  let totalOutflow = 0

  const allSymbols = new Set([...Object.keys(inflowMap), ...Object.keys(outflowMap)])

  for (const symbol of allSymbols) {
    const inflow = inflowMap[symbol] ?? 0
    const outflow = outflowMap[symbol] ?? 0
    const hold = inflow - outflow

    if (inflow === 0 && outflow === 0 && hold === 0) continue

    tokens.push({ token: symbol, inflow, outflow, hold })
    totalInflow += inflow
    totalOutflow += outflow
  }

  const totalHold = totalInflow - totalOutflow

  return {
    wallet,
    tokens,
    totalInflow,
    totalOutflow,
    totalHold
  }
}

export class SmartWalletTrackerService {
  /**
   * Ambil list smart wallet dari database (smart_wallets), lalu
   * fetch transaksi tiap wallet dari Etherscan dan hitung inflow/outflow/hold.
   * Data hasil disimpan di smart_wallet_trackers: setiap run menghapus data
   * tracker lama lalu menyimpan data terbaru dalam satu transaction (rollback jika error).
   *
   * Mengembalikan array of SmartWalletFlow yang siap dipakai controller.
   */
  static async getSmartWalletFlows(): Promise<SmartWalletFlow[]> {
    const wallets = await SmartWalletModel.findAll({
      where: { deleted: 0 },
      attributes: ['smartWalletId', 'smartWalletAddress']
    })

    if (wallets.length === 0) {
      return []
    }

    const items: SmartWalletFlow[] = []
    const computed: Array<{ smartWalletId: number; flow: SmartWalletFlow }> = []

    for (const row of wallets) {
      const { smartWalletId, smartWalletAddress } = row.get({
        plain: true
      }) as { smartWalletId: number; smartWalletAddress: string }

      const txs = await fetchTransactions(smartWalletAddress)
      const flow = analyzeTransactions(smartWalletAddress, txs)
      items.push(flow)
      computed.push({ smartWalletId, flow })

      // delay agar tidak kena rate limit
      await sleep(1500)
    }

    await sequelizeInit.transaction(async (t) => {
      const walletIds = computed.map((c) => c.smartWalletId)
      if (walletIds.length === 0) {
        return
      }

      await SmartWalletTrackerModel.destroy({
        where: {
          smartWalletTrackerSmartTrackerId: {
            [Op.in]: walletIds
          }
        },
        transaction: t
      })

      const rows: Array<{
        smartWalletTrackerSmartTrackerId: number
        smartWalletTrackerWalletAddress: string
        smartWalletTrackerTokenName: string
        smartWalletTrackerInflow: number
        smartWalletTrackerOutflow: number
      }> = []

      for (const { smartWalletId, flow } of computed) {
        for (const tokenFlow of flow.tokens) {
          rows.push({
            smartWalletTrackerSmartTrackerId: smartWalletId,
            smartWalletTrackerWalletAddress: flow.wallet,
            smartWalletTrackerTokenName: tokenFlow.token,
            smartWalletTrackerInflow: tokenFlow.inflow,
            smartWalletTrackerOutflow: tokenFlow.outflow
          })
        }
      }

      if (rows.length > 0) {
        await SmartWalletTrackerModel.bulkCreate(rows, { transaction: t })
      }
    })

    return items
  }
}
