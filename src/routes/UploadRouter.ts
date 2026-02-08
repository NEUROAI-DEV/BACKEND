import { Router, type Request, type Response, type NextFunction } from 'express'
import multer from 'multer'
import { StatusCodes } from 'http-status-codes'
import { UploadController } from '../controllers/upload'
import { uploadImageMiddleware } from '../configs/multer'
import { ResponseData } from '../utilities/response'

const UploadRouter = Router()

UploadRouter.post(
  '/image',
  (req: Request, res: Response, next: NextFunction) => {
    uploadImageMiddleware.single('image')(req, res, (err: unknown) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(StatusCodes.BAD_REQUEST).json(
              ResponseData.error({ message: 'File size must not exceed 2MB' })
            )
          }
          return res.status(StatusCodes.BAD_REQUEST).json(
            ResponseData.error({ message: err.message ?? 'Upload error' })
          )
        }
        return res.status(StatusCodes.BAD_REQUEST).json(
          ResponseData.error({
            message:
              err instanceof Error ? err.message : 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP'
          })
        )
      }
      next()
    })
  },
  UploadController.uploadImage
)

export default UploadRouter
