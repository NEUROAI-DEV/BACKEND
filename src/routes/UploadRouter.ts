import { Router } from 'express'
import { UploadController } from '../controllers/upload'

const UploadRouter = Router()

// GET /api/v1/uploads?imageBase64=data:image/png;base64,... -> { url }
UploadRouter.get('/', UploadController.uploadToCloudinary)

export default UploadRouter
