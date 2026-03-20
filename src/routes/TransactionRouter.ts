import { Router } from 'express'
import { TransactionController } from '../controllers/transaction'
import { MiddleWares } from '../middlewares'
import {
  CreateTransactionSchema,
  FindAllTransactionSchema,
  FindDetailTransactionSchema,
  RemoveTransactionSchema,
  UpdateTransactionSchema
} from '../schemas/TransactionSchema'

const TransactionRouter = Router()

TransactionRouter.get(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ query: FindAllTransactionSchema }),
  TransactionController.findAll
)

TransactionRouter.get(
  '/detail/:transactionId',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ params: FindDetailTransactionSchema }),
  TransactionController.findDetail
)

TransactionRouter.post(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: CreateTransactionSchema }),
  TransactionController.create
)

TransactionRouter.patch(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ body: UpdateTransactionSchema }),
  TransactionController.update
)

TransactionRouter.delete(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ body: RemoveTransactionSchema }),
  TransactionController.remove
)

export default TransactionRouter
