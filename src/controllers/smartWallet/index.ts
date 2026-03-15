import { createSmartWallet } from './create'
import { findAllSmartWallet } from './findAll'
import { findDetailSmartWallet } from './findDetail'
import { updateSmartWallet } from './update'
import { removeSmartWallet } from './remove'

export const SmartWalletController = {
  findAll: findAllSmartWallet,
  findDetail: findDetailSmartWallet,
  create: createSmartWallet,
  update: updateSmartWallet,
  remove: removeSmartWallet
}
