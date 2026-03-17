import { Router } from 'express'
import multer from 'multer'
import { UploadController } from '../controllers/upload'

const UploadRouter = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
})

// POST /api/v1/uploads/images with multipart/form-data (field: image)
UploadRouter.post('/images', upload.single('image'), UploadController.uploadToCloudinary)

export default UploadRouter
