import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/errorHandler'

export const uploadImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.file) {
      const response = ResponseData.error({
        message: 'No file uploaded. Please send an image with field name "image".'
      })
      return res.status(StatusCodes.BAD_REQUEST).json(response)
    }

    const fileName = req.file.filename
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const url = `${baseUrl}/uploads/images/${fileName}`

    const response = ResponseData.success({
      data: { fileName, url },
      message: 'Image uploaded successfully'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
