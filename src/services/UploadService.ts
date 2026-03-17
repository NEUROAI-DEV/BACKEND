import cloudinary from '../configs/cloudinary'
import { AppError } from '../utilities/errorHandler'

export class UploadService {
  static async uploadImageFromDataUri(params: {
    dataUri: string
    folder?: string
  }): Promise<{ url: string; publicId: string }> {
    const { dataUri, folder } = params

    if (!dataUri || typeof dataUri !== 'string') {
      throw AppError.badRequest('imageBase64 is required')
    }

    // Basic guard: must be data URI
    if (!dataUri.startsWith('data:image/')) {
      throw AppError.badRequest(
        'imageBase64 must be a data URI (e.g. data:image/png;base64,...)'
      )
    }

    const res = await cloudinary.uploader.upload(dataUri, {
      folder: folder ?? 'uploads',
      resource_type: 'image'
    })

    return {
      url: res.secure_url,
      publicId: res.public_id
    }
  }
}
