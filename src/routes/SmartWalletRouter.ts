import { Router } from 'express'
import { SmartWalletController } from '../controllers/smartWallet'
import { MiddleWares } from '../middlewares'
import {
  CreateSmartWalletSchema,
  FindAllSmartWalletSchema,
  FindDetailSmartWalletSchema,
  RemoveSmartWalletSchema,
  UpdateSmartWalletSchema
} from '../schemas/SmartWalletSchema'

const SmartWalletRouter = Router()

SmartWalletRouter.get(
  '/',
  MiddleWares.validate({ query: FindAllSmartWalletSchema }),
  SmartWalletController.findAll
)

SmartWalletRouter.get(
  '/admin',
  MiddleWares.useAuthorization,
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ query: FindAllSmartWalletSchema }),
  SmartWalletController.findAllAdmin
)

SmartWalletRouter.get(
  '/detail/:smartWalletId',
  MiddleWares.validate({ params: FindDetailSmartWalletSchema }),
  SmartWalletController.findDetail
)

SmartWalletRouter.post(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ body: CreateSmartWalletSchema }),
  SmartWalletController.create
)

SmartWalletRouter.patch(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ body: UpdateSmartWalletSchema }),
  SmartWalletController.update
)

SmartWalletRouter.delete(
  '/:smartWalletId',
  MiddleWares.useAuthorization,
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ params: RemoveSmartWalletSchema }),
  SmartWalletController.remove
)

export default SmartWalletRouter
