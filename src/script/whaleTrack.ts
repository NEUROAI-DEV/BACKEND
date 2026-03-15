import axios from 'axios'

const ETHERSCAN_API_KEY = '1F92M63X1BMA7UWBEEG4AVTH4FYKGM7N1H'

// daftar wallet whale
const WALLETS = [
  '0x28C6c06298d514Db089934071355E5743bf21d60',
  '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549',
  '0xF977814e90dA44bFA03b6295A0616a897441aceC'
]

interface Tx {
  from: string
  to: string
  value: string
  tokenSymbol: string
  tokenDecimal: string
}

interface TokenFlow {
  token: string
  inflow: number
  outflow: number
  hold: number
}

interface WalletFlow {
  wallet: string
  tokens: TokenFlow[]
  totalInflow: number
  totalOutflow: number
  totalHold: number
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchTransactions(wallet: string): Promise<Tx[]> {
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
    throw new Error(`API Error: ${res.data.result}`)
  }

  return res.data.result
}

function analyzeTransactions(wallet: string, txs: Tx[]): WalletFlow {
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

  const tokens: TokenFlow[] = []
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

async function run() {
  try {
    const items: WalletFlow[] = []

    for (const wallet of WALLETS) {
      const txs = await fetchTransactions(wallet)
      const flow = analyzeTransactions(wallet, txs)
      items.push(flow)

      // delay agar tidak kena rate limit
      await sleep(1500)
    }

    // Array of object siap pakai, mengikuti pola response API (tanpa wrapper success/message)
    // Jika ingin mengikuti pola penuh, client bisa membungkus sendiri:
    // { success: true, message: '...', data: { items }, meta: {} }
    console.log(JSON.stringify(items, null, 2))
  } catch (err) {
    console.error(err)
  }
}

run()

// // whale wallet
// const WALLET = '0x28C6c06298d514Db089934071355E5743bf21d60'

// interface Tx {
//   from: string
//   to: string
//   value: string
//   tokenSymbol: string
//   tokenDecimal: string
// }

// async function fetchTransactions(): Promise<Tx[]> {
//   const res = await axios.get('https://api.etherscan.io/v2/api', {
//     params: {
//       chainid: 1, // ethereum mainnet
//       module: 'account',
//       action: 'tokentx',
//       address: WALLET,
//       page: 1,
//       offset: 20,
//       sort: 'desc',
//       apikey: ETHERSCAN_API_KEY
//     }
//   })

//   console.log('FULL RESPONSE:')
//   console.log(res.data)

//   if (!Array.isArray(res.data.result)) {
//     throw new Error(`API Error: ${res.data.result}`)
//   }

//   return res.data.result
// }

// function analyzeTransactions(txs: Tx[]) {
//   const portfolio: Record<string, number> = {}

//   for (const tx of txs) {
//     if (!tx.from || !tx.to) continue

//     const symbol = tx.tokenSymbol
//     const decimals = Number(tx.tokenDecimal)

//     const value = Number(tx.value) / Math.pow(10, decimals)

//     if (!portfolio[symbol]) {
//       portfolio[symbol] = 0
//     }

//     if (tx.to.toLowerCase() === WALLET.toLowerCase()) {
//       console.log(`INFLOW (BUY) ${symbol} +${value}`)

//       portfolio[symbol] += value
//     } else if (tx.from.toLowerCase() === WALLET.toLowerCase()) {
//       console.log(`OUTFLOW (SELL) ${symbol} -${value}`)

//       portfolio[symbol] -= value
//     }
//   }

//   return portfolio
// }

// function printPortfolio(portfolio: Record<string, number>) {
//   console.log('\n=== HOLDING ===\n')

//   for (const token in portfolio) {
//     const balance = portfolio[token]

//     if (balance > 0) {
//       console.log(`${token} HOLD ${balance}`)
//     }
//   }
// }

// async function run() {
//   try {
//     console.log('Fetching whale transactions...\n')

//     const txs = await fetchTransactions()

//     console.log(`Total tx: ${txs.length}`)

//     const portfolio = analyzeTransactions(txs)

//     printPortfolio(portfolio)
//   } catch (err) {
//     console.error('ERROR:', err)
//   }
// }

// run()
