import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { AppError, handleError } from '../../utilities/errorHandler'
import { UploadService } from '../../services/UploadService'

export const uploadToCloudinary = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const file = req.file

    if (!file) {
      throw AppError.badRequest('image file is required')
    }

    const mimeType = file.mimetype
    if (!mimeType.startsWith('image/')) {
      throw AppError.badRequest('Only image files are allowed')
    }

    const base64 = file.buffer.toString('base64')
    const dataUri = `data:${mimeType};base64,${base64}`

    const { url } = await UploadService.uploadImageFromDataUri({
      dataUri,
      folder: 'neuroai'
    })

    return res.status(StatusCodes.OK).json(
      ResponseData.success({
        message: 'Image uploaded successfully',
        data: {
          url
        }
      })
    )
  } catch (err) {
    return handleError(res, err)
  }
}
