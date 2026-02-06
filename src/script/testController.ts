// import { TopSignalsService } from '../services/market/TopSignalsService'

// const testTopSignal = async () => {
//   const data = await TopSignalsService.getTopSignals(5)
//   console.log(data)
// }

// testTopSignal()

import { BinanceService } from '../services/external/BinanceService'
import { IconCoinService } from '../services/external/IconCoinService'
import { AiSignalService } from '../services/llm/AiSignalService'
import { CoinAnalysisService } from '../services/llm/CoinAnalysisService'
import { LivePricePredictionService } from '../services/llm/LivePricePredictionService'

async function AiSignalsController() {
  //   const signals = await AiSignalService.generateSignals()

  //   console.log(signals)

  //   const result = await CoinAnalysisService.analyze('DOGEUSDT', 'SWING')

  //   console.log(result)

  // const result = await LivePricePredictionService.predict('DOGEUSDT', 'SWING')
  // const result = await BinanceService.getAllSymbols()

  const result = await IconCoinService.getIcon('DOGEUSDT')

  console.log(result)
}

AiSignalsController()
