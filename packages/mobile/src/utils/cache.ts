import { Asset } from 'expo-asset'
import { Image } from 'react-native'

export function cacheImages(images: string[]) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image)
    }

    return Asset.fromModule(image).downloadAsync()
  })
}
