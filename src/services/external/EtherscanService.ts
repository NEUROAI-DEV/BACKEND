import axios from 'axios'
import { appConfigs } from '../../configs'

export class EtherscanService {
  static async fetchWalletERC20Tx(walletAddress: string): Promise<any[]> {
    const response = await axios.get(appConfigs.etherScan.baseUrl!, {
      params: {
        module: 'account',
        action: 'tokentx',
        address: walletAddress,
        startblock: 0,
        endblock: 99999999,
        sort: 'asc',
        apikey: appConfigs.etherScan.token
      }
    })

    return response.data.result || []
  }
}
