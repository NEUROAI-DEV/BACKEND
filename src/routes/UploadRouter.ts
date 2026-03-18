import { Router } from 'express'
import multer from 'multer'
import { UploadController } from '../controllers/upload'
import { MiddleWares } from '../middlewares'

const UploadRouter = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
})

UploadRouter.post(
  '/images',
  upload.single('image'),
  MiddleWares.useAuthorization,
  MiddleWares.allowAppRoles('admin'),
  UploadController.uploadToCloudinary
)

export default UploadRouter
