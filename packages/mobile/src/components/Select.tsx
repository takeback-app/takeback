import React, { ReactNode } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select'

interface SelectProps extends PickerSelectProps {
  placeholder: string
}

function SelectIcon() {
  return <Ionicons name="chevron-down" size={24} color="#6b7280" />
}

export function Select({ placeholder, ...rest }: SelectProps) {
  return (
    <RNPickerSelect
      style={pickerSelectStyles}
      useNativeAndroidPickerStyle={false}
      Icon={SelectIcon as unknown as ReactNode}
      placeholder={{
        label: placeholder,
        value: null
      }}
      {...rest}
    />
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontFamily: 'Montserrat_500Medium',
    color: '#1f2937',
    paddingRight: 30 // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontFamily: 'Montserrat_500Medium',
    color: '#1f2937',
    paddingRight: 30 // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 10,
    right: 12
  }
})
