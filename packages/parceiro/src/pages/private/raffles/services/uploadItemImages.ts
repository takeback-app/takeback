import { Item } from '../components/EditItemsCard'
import { storeImage } from './api'

interface ItemComplete {
  description: string
  order: number
  imageUrl: string
}

export async function uploadItemImages(items: Item[]) {
  const itemsWithImageUrl: ItemComplete[] = []
  const errors: string[] = []

  for (const item of items) {
    if (item.imageUrl) {
      itemsWithImageUrl.push({
        description: item.description,
        imageUrl: item.imageUrl,
        order: item.order
      })

      continue
    }

    if (item.image) {
      const [isImageOk, imageData] = await storeImage(item.image)

      if (!isImageOk) {
        errors.push(imageData.message || '')
        continue
      }

      itemsWithImageUrl.push({
        description: item.description,
        imageUrl: imageData.url,
        order: item.order
      })
    }
  }

  return { itemsWithImageUrl, errors }
}
