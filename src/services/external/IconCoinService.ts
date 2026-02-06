export class IconCoinService {
  static getIcon(symbol: string) {
    const base = symbol.replace('USDT', '').toLowerCase()
    return `https://cryptoicons.org/api/icon/${base}/64`
  }
}
