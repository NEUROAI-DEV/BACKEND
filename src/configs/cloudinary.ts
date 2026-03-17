import { v2 as cloudinary } from 'cloudinary'
import { appConfigs } from './index'

cloudinary.config({
  cloud_name: appConfigs.cloudinary.cloudName,
  api_key: appConfigs.cloudinary.apiKey,
  api_secret: appConfigs.cloudinary.apiSecret,
  secure: true
})

export default cloudinary
