import { createSmartWallet } from './create'
import { findAllSmartWallet } from './findAll'
import { findAllSmartWalletsAdmin } from './findAllAdmin'
import { findDetailSmartWallet } from './findDetail'
import { updateSmartWallet } from './update'
import { removeSmartWallet } from './remove'

export const SmartWalletController = {
  findAll: findAllSmartWallet,
  findAllAdmin: findAllSmartWalletsAdmin,
  findDetail: findDetailSmartWallet,
  create: createSmartWallet,
  update: updateSmartWallet,
  remove: removeSmartWallet
}
