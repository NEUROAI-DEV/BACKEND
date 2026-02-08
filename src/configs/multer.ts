import multer from 'multer'
import path from 'path'
import fs from 'fs'
import type { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'images')

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
]

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    cb(null, `${uuidv4()}${ext}`)
  }
})

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP'))
  }
}

export const uploadImageMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
})

export const UPLOAD_MAX_FILE_SIZE = MAX_FILE_SIZE
export const UPLOAD_IMAGES_DIR = UPLOAD_DIR
