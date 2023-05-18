import { StyleSheet } from 'react-native'
import { roundPixel } from './CalculateDPI'

const shadow = StyleSheet.create({
  shadow: {
    shadowColor: '#00000090',
    shadowOffset: {
      width: roundPixel(2),
      height: roundPixel(4)
    },
    shadowOpacity: 0.12,
    shadowRadius: 3.8,
    elevation: 3
  },
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: roundPixel(10)
    },
    shadowOpacity: 0.24,
    shadowRadius: 15,
    elevation: 15
  }
})

export { shadow }
