import multer from 'multer'
import path from 'path'
import fs from 'fs'
import os from 'os'
import type { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'images')
// PDFs ke temp dir agar tidak memicu file watcher (restart) dan otomatis dibersihkan
const PDF_DIR = path.join(os.tmpdir(), 'neuroai-pdf-uploads')

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true })
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

const pdfStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PDF_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf'
    cb(null, `${uuidv4()}${ext}`)
  }
})

const pdfFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PDF is allowed.'))
  }
}

export const uploadImageMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
})

export const uploadPdfMiddleware = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: MAX_PDF_SIZE }
})

export const UPLOAD_MAX_FILE_SIZE = MAX_FILE_SIZE
export const UPLOAD_IMAGES_DIR = UPLOAD_DIR
export const UPLOAD_PDF_DIR = PDF_DIR
export const UPLOAD_MAX_PDF_SIZE = MAX_PDF_SIZE
