import { createCoin } from './create'
import { findAllCoin } from './findAll'
import { findDetailCoin } from './findDetail'
import { updateCoin } from './update'
import { removeCoin } from './remove'

export const CoinController = {
  findAll: findAllCoin,
  findDetail: findDetailCoin,
  create: createCoin,
  update: updateCoin,
  remove: removeCoin
}
