import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { UploadService } from '../../services/UploadService'

export const uploadToCloudinary = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const imageBase64 =
      typeof req.query.imageBase64 === 'string' ? req.query.imageBase64 : ''
    const folder = typeof req.query.folder === 'string' ? req.query.folder : undefined

    const { url } = await UploadService.uploadImageFromDataUri({
      dataUri: imageBase64,
      folder
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
