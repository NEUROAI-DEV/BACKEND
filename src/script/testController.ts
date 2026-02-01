// import { TopSignalsService } from '../services/market/TopSignalsService'

// const testTopSignal = async () => {
//   const data = await TopSignalsService.getTopSignals(5)
//   console.log(data)
// }

// testTopSignal()

import { AiSignalService } from '../services/llm/AiSignalService'
import { CoinAnalysisService } from '../services/llm/CoinAnalysisService'

async function AiSignalsController() {
  //   const signals = await AiSignalService.generateSignals()

  //   console.log(signals)

  const result = await CoinAnalysisService.analyze('DOGEUSDT', 'SWING')

  console.log(result)
}

AiSignalsController()
