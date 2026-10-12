import sharp from 'sharp'
import { InternalError } from '../../config/GenerateErros'
import StorageFactory from '../../services/Storage'

export const AUCTION_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const AUCTION_IMAGE_MAX_COUNT = 6
export const AUCTION_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const AUCTION_IMAGE_FILE_NAME = 'desapega.jpg'
const AUCTION_IMAGE_MAX_DIMENSION = 1600
const allowedFormats = ['jpeg', 'png', 'webp']
const storedFilePattern = new RegExp(
  `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-${AUCTION_IMAGE_FILE_NAME.replace(
    '.',
    '\\.',
  )}$`,
)

function storageBaseUrl() {
  if (process.env.STORAGE_TYPE === 's3') {
    return `${process.env.AWS_S3_PUBLIC_URL?.replace(/\/$/, '')}/`
  }

  return `${process.env.API_URL}/uploads/`
}

export function isAuctionImageUrl(url: string) {
  const baseUrl = storageBaseUrl()

  return (
    url.startsWith(baseUrl) && storedFilePattern.test(url.slice(baseUrl.length))
  )
}

export async function normalizeAuctionImage(buffer: Buffer) {
  const metadata = await sharp(buffer)
    .metadata()
    .catch(() => null)

  if (!metadata || !allowedFormats.includes(metadata.format)) {
    throw new InternalError(
      'Arquivo de imagem inválido. Use JPG, PNG ou WEBP.',
      400,
    )
  }

  // Re-encoding drops EXIF data, including the GPS location of phone photos.
  return sharp(buffer)
    .rotate()
    .resize({
      width: AUCTION_IMAGE_MAX_DIMENSION,
      height: AUCTION_IMAGE_MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82 })
    .toBuffer()
}

export class UploadAuctionImageUseCase {
  async execute(file: Express.Multer.File) {
    const buffer = await normalizeAuctionImage(file.buffer)

    const url = await StorageFactory.getStorage().upload({
      ...file,
      buffer,
      size: buffer.length,
      mimetype: 'image/jpeg',
      originalname: AUCTION_IMAGE_FILE_NAME,
    })

    return { url }
  }
}
