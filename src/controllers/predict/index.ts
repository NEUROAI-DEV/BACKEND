import { findAllPredict } from './findAll'
import { runPredictions } from './runPredictions'
import { removePredict } from './remove'
import { updateAllPredictByUser } from './updateAllByUser'

export const PredictController = {
  findAll: findAllPredict,
  runPredictions,
  remove: removePredict,
  updateAllByUser: updateAllPredictByUser
}
