import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Box, Pressable } from 'native-base'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

const config = {
  duration: 500,
  easing: Easing.bezier(0.5, 0.01, 0, 1)
}

const screenWidth = Dimensions.get('window').width

interface AnimatedImageBoxProps {
  uri?: string
}

export function AnimatedImageBox({ uri }: AnimatedImageBoxProps) {
  const animatedImageWeight = useSharedValue(300)
  const imageOpacity = useSharedValue(0)

  const style = useAnimatedStyle(() => {
    return {
      width: '100%',
      height: withTiming(animatedImageWeight.value, config),
      opacity: withTiming(imageOpacity.value, { ...config, duration: 750 })
    }
  })

  const [imageHeight, setImageHeight] = useState(0)
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  useEffect(() => {
    if (!uri) return

    Image.getSize(uri, (w, h) => {
      const height = (h * screenWidth) / w
      setImageHeight(height)
    })
  }, [uri, imageHeight])

  return (
    <Pressable
      position="relative"
      bg="gray.300"
      justifyContent="center"
      onPress={() => {
        if (!imageHeight) return

        animatedImageWeight.value = isImageExpanded ? 300 : imageHeight

        setIsImageExpanded(state => !state)
      }}
    >
      <ActivityIndicator
        style={{
          position: 'absolute',
          alignSelf: 'center',
          display: imageOpacity.value ? 'none' : 'flex'
        }}
        size="large"
      />
      <Animated.Image
        onLoadEnd={() => {
          imageOpacity.value = 1
        }}
        source={{ uri }}
        style={style}
      />
      <Box
        position="absolute"
        bg="white"
        bottom={4}
        p={1}
        rounded="full"
        shadow="1"
        alignSelf="center"
      >
        {isImageExpanded ? (
          <MaterialCommunityIcons name="chevron-up" size={16} />
        ) : (
          <MaterialCommunityIcons name="chevron-down" size={16} />
        )}
      </Box>
    </Pressable>
  )
}
