import { useToken } from 'native-base'
import React from 'react'

import { Image, ImageProps } from 'react-native'

// import { Image, ImageProps } from 'expo-image'

// const blurhash =
//   '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

export function LoadingImage(props: ImageProps) {
  const [borderColor] = useToken('colors', ['blue.700'])

  return (
    <Image
      // placeholder={blurhash}
      // contentFit="cover"
      // transition={1000}
      {...props}
      style={[{ borderWidth: 1.5, borderColor }, props.style]}
    />
  )
}
