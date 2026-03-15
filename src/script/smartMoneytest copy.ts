import { ethers } from 'ethers'

interface WalletStats {
  buy: bigint
  sell: bigint
  trades: number
}

interface RankingResult {
  wallet: string
  trades: number
  profit: bigint
}

export class SmartWallet {
  private provider: ethers.JsonRpcProvider
  private pairAddress: string
  private blocksBack: number

  private static SWAP_TOPIC = ethers.id(
    'Swap(address,uint256,uint256,uint256,uint256,address)'
  )

  constructor(rpc: string, pairAddress: string, blocksBack: number = 3000) {
    this.provider = new ethers.JsonRpcProvider(rpc)
    this.pairAddress = pairAddress
    this.blocksBack = blocksBack
  }

  private async getBlockRange() {
    const latestBlock = await this.provider.getBlockNumber()
    const fromBlock = latestBlock - this.blocksBack

    console.log('Latest block:', latestBlock)
    console.log('Scanning blocks:', fromBlock, '→', latestBlock)

    return { fromBlock, latestBlock }
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async getSwapLogs() {
    const { fromBlock, latestBlock } = await this.getBlockRange()

    const step = 10
    let currentFrom = fromBlock
    const allLogs: ethers.Log[] = []

    while (currentFrom <= latestBlock) {
      const currentTo = Math.min(currentFrom + step - 1, latestBlock)

      console.log(`Fetching logs: ${currentFrom} → ${currentTo}`)

      try {
        const logs = await this.provider.getLogs({
          address: this.pairAddress,
          fromBlock: currentFrom,
          toBlock: currentTo,
          topics: [SmartWallet.SWAP_TOPIC]
        })

        allLogs.push(...logs)

        // 🔥 throttle biar tidak 429
        await this.sleep(150)

        currentFrom = currentTo + 1
      } catch (err: any) {
        if (err?.error?.code === 429) {
          console.log('Rate limited. Waiting 1 second...')
          await this.sleep(1000)
        } else {
          throw err
        }
      }
    }

    console.log('Total swap events:', allLogs.length)

    return allLogs
  }

  private buildStats(logs: ethers.Log[]) {
    const walletStats: Record<string, WalletStats> = {}

    for (const log of logs) {
      const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
        ['uint256', 'uint256', 'uint256', 'uint256'],
        log.data
      )

      const amount0In = decoded[0] as bigint
      const amount0Out = decoded[2] as bigint

      const trader = ethers.getAddress('0x' + log.topics[2].slice(26))

      if (!walletStats[trader]) {
        walletStats[trader] = {
          buy: 0n,
          sell: 0n,
          trades: 0
        }
      }

      walletStats[trader].trades++

      // token0 = WETH (untuk pair WETH/USDT)
      if (amount0In > 0n) {
        walletStats[trader].sell += amount0In
      }

      if (amount0Out > 0n) {
        walletStats[trader].buy += amount0Out
      }
    }

    return walletStats
  }

  private async isContract(address: string) {
    const code = await this.provider.getCode(address)
    return code !== '0x'
  }
  private async filterAndRank(
    walletStats: Record<string, WalletStats>
  ): Promise<RankingResult[]> {
    const ranking: RankingResult[] = []

    for (const [wallet, stats] of Object.entries(walletStats)) {
      const isContract = await this.isContract(wallet)
      if (isContract) continue

      const volume = stats.buy + stats.sell

      ranking.push({
        wallet,
        trades: stats.trades,
        profit: volume // kita pakai volume dulu
      })
    }

    ranking.sort((a, b) => Number(b.profit - a.profit))

    return ranking
  }

  public async run(top: number = 10) {
    console.log('\n=== SMART WALLET SCAN START ===\n')

    const logs = await this.getSwapLogs()
    const stats = this.buildStats(logs)
    const ranking = await this.filterAndRank(stats)

    console.log('\nSMART WALLETS (Top', top, '):\n')

    console.log(ranking)

    ranking.slice(0, top).forEach((w, i) => {
      console.log(
        `#${i + 1}`,
        w.wallet,
        '| Trades:',
        w.trades,
        '| Profit (ETH):',
        ethers.formatEther(w.profit)
      )
    })

    console.log('\n=== DONE ===\n')
  }
}

const ALCHEMY_RPC = 'https://eth-mainnet.g.alchemy.com/v2/GXvCOzvhpBNm4J_l66dfH'

const RPC = ALCHEMY_RPC

const PAIR = '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852' // WETH/USDT

async function start() {
  const scanner = new SmartWallet(RPC, PAIR, 500)
  await scanner.run(10)
}

start().catch(console.error)
