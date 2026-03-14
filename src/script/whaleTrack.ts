import axios from 'axios'

const ETHERSCAN_API_KEY = ''

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

function analyzeTransactions(wallet: string, txs: Tx[]) {
  const portfolio: Record<string, number> = {}

  for (const tx of txs) {
    if (!tx.from || !tx.to) continue

    const symbol = tx.tokenSymbol
    const decimals = Number(tx.tokenDecimal)

    const value = Number(tx.value) / Math.pow(10, decimals)

    if (!portfolio[symbol]) {
      portfolio[symbol] = 0
    }

    if (tx.to.toLowerCase() === wallet.toLowerCase()) {
      console.log(`[${wallet}] INFLOW (BUY) ${symbol} +${value}`)

      portfolio[symbol] += value
    } else if (tx.from.toLowerCase() === wallet.toLowerCase()) {
      console.log(`[${wallet}] OUTFLOW (SELL) ${symbol} -${value}`)

      portfolio[symbol] -= value
    }
  }

  return portfolio
}

function printPortfolio(wallet: string, portfolio: Record<string, number>) {
  console.log(`\n=== HOLDING ${wallet} ===\n`)

  for (const token in portfolio) {
    const balance = portfolio[token]

    if (balance > 0) {
      console.log(`${token} HOLD ${balance}`)
    }
  }
}

async function run() {
  try {
    console.log('Scanning whale wallets...\n')

    for (const wallet of WALLETS) {
      console.log(`\n====== WALLET ${wallet} ======\n`)

      const txs = await fetchTransactions(wallet)

      console.log(`Total tx: ${txs.length}`)

      const portfolio = analyzeTransactions(wallet, txs)

      printPortfolio(wallet, portfolio)

      // delay agar tidak kena rate limit
      await sleep(1500)
    }
  } catch (err) {
    console.error('ERROR:', err)
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
