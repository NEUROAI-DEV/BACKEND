import axios from 'axios'

const API_KEY = '1F92M63X1BMA7UWBEEG4AVTH4FYKGM7N1H'
const WALLET = '0xYourWalletAddress'

interface EtherscanTx {
  tokenSymbol: string
  tokenDecimal: string
  value: string
  from: string
  to: string
}

interface Record {
  token: string
  amount: number
  direction: string
}

async function fetchTransactions(): Promise<EtherscanTx[]> {
  const url = `https://api.etherscan.io/v2/api?module=account&action=tokentx&address=${WALLET}&page=1&offset=100&sort=desc&apikey=${API_KEY}`

  const response = await axios.get(url)

  if (response.data.status !== '1') {
    throw new Error('Failed to fetch transactions')
  }

  return response.data.result
}

function analyzeTransactions(transactions: EtherscanTx[]) {
  const wallet = WALLET.toLowerCase()

  const records: Record[] = []

  const portfolio: Record<string, number> = {}

  for (const tx of transactions) {
    const token = tx.tokenSymbol
    const value = Number(tx.value) / Math.pow(10, Number(tx.tokenDecimal))

    const from = tx.from.toLowerCase()
    const to = tx.to.toLowerCase()

    let direction = 'UNKNOWN'

    if (to === wallet) {
      direction = 'BUY / INFLOW'
      portfolio[token] = (portfolio[token] || 0) + value
    }

    if (from === wallet) {
      direction = 'SELL / OUTFLOW'
      portfolio[token] = (portfolio[token] || 0) - value
    }

    records.push({
      token,
      amount: value,
      direction
    })
  }

  return { records, portfolio }
}

async function run() {
  try {
    const txs = await fetchTransactions()

    const result = analyzeTransactions(txs)

    console.log('\n=== TRANSACTIONS ===\n')
    console.table(result.records)

    console.log('\n=== HOLDINGS ===\n')

    for (const token in result.portfolio) {
      const balance = result.portfolio[token]

      if (balance > 0) {
        console.log(`${token} : HOLD ${balance}`)
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

run()
