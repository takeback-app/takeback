import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { InternalError } from '../config/GenerateErros'
import {
  AUCTION_IMAGE_MAX_BYTES,
  AUCTION_IMAGE_MIME_TYPES,
} from '../useCases/auction/AuctionImages'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: AUCTION_IMAGE_MAX_BYTES, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!AUCTION_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new InternalError('Formato não permitido. Use JPG, PNG ou WEBP.', 400),
      )
    }

    callback(null, true)
  },
}).single('file')

export function AuctionImageUploadMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === 'LIMIT_FILE_SIZE'
          ? 'A imagem deve ter no máximo 5 MB'
          : 'Envie uma única imagem no campo "file"'

      return next(new InternalError(message, 400))
    }

    if (error) return next(error)

    if (!request.file) {
      return next(new InternalError('Nenhuma imagem enviada', 400))
    }

    next()
  })
}
