import cloudinary from '../configs/cloudinary'
import { AppError } from '../utilities/errorHandler'

export class UploadService {
  static async uploadImageFromDataUri(params: {
    dataUri: string
    folder?: string
  }): Promise<{ url: string; publicId: string }> {
    const { dataUri, folder } = params

    if (!dataUri || typeof dataUri !== 'string') {
      throw AppError.badRequest('image data is required')
    }

    // Basic guard: must be data URI
    if (!dataUri.startsWith('data:image/')) {
      throw AppError.badRequest(
        'image must be a data URI (e.g. data:image/png;base64,...)'
      )
    }

    let res: { secure_url: string; public_id: string }
    try {
      res = (await cloudinary.uploader.upload(dataUri, {
        folder: folder ?? 'uploads',
        resource_type: 'image'
      })) as unknown as { secure_url: string; public_id: string }
    } catch (err: unknown) {
      if (err instanceof Error) throw err
      throw new Error(`Cloudinary upload failed: ${JSON.stringify(err)}`)
    }

    return {
      url: res.secure_url,
      publicId: res.public_id
    }
  }
}
