import { findAllPredict } from './findAll'
import { runPredictions } from './runPredictions'
import { removePredict } from './remove'

export const PredictController = {
  findAll: findAllPredict,
  runPredictions,
  remove: removePredict
}
