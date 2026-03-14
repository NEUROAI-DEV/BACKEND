import { createLivePredict } from './create'
import { findAllLivePredict } from './findAll'
import { findDetailLivePredict } from './findDetail'
import { updateLivePredict } from './update'
import { removeLivePredict } from './remove'

export const LivePredictController = {
  findAll: findAllLivePredict,
  findDetail: findDetailLivePredict,
  create: createLivePredict,
  update: updateLivePredict,
  remove: removeLivePredict
}
