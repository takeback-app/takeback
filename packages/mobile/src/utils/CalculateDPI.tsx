import { PixelRatio } from 'react-native'

// This function calculates the pixel density of the device's screen height.
const heightDPI = (value: number, dimension: number): number => {
  const heightInDPI = PixelRatio.roundToNearestPixel(dimension)

  return (heightInDPI * value) / 100
}

// This function calculates the pixel density of the device's screen width.
const widthDPI = (value: number, dimension: number): number => {
  const widthInDPI = PixelRatio.roundToNearestPixel(dimension)

  return (widthInDPI * value) / 100
}

// This function calculates the pixel density of the device's window height.
const roundPixel = (value: number): number => {
  return PixelRatio.roundToNearestPixel(value)
}

export { heightDPI, widthDPI, roundPixel }
