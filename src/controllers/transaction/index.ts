import { createTransaction } from './create'
import { findAllTransaction } from './findAll'
import { findDetailTransaction } from './findDetail'
import { updateTransaction } from './update'
import { removeTransaction } from './remove'

export const TransactionController = {
  findAll: findAllTransaction,
  findDetail: findDetailTransaction,
  create: createTransaction,
  update: updateTransaction,
  remove: removeTransaction
}
