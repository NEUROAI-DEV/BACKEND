import { createTransaction } from './create'
import { findAllTransaction } from './findAll'

export const transactionControllers = {
  findAll: findAllTransaction,
  create: createTransaction
}
