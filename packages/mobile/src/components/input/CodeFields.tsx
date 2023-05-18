import React from 'react'
import { Text, StyleSheet } from 'react-native'
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field'

const CELL_COUNT = 6

interface CodeFieldsProps {
  value: string
  setValue: (_value: string) => void
  autoFocus?: boolean
  onBlur?: () => void
}

export function CodeFields({
  value,
  setValue,
  autoFocus,
  onBlur
}: CodeFieldsProps) {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  })

  function renderCell({ index, symbol, isFocused }: RenderCellOptions) {
    let textChild: React.ReactNode = null

    if (symbol) {
      textChild = '•'
    } else if (isFocused) {
      textChild = <Cursor />
    }

    return (
      <Text
        key={index}
        style={[
          styles.textInput,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          isFocused ? (styles.focusedTextInput as any) : null
        ]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {textChild}
      </Text>
    )
  }

  return (
    <CodeField
      autoFocus={autoFocus}
      ref={ref}
      {...props}
      onBlur={onBlur}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={{ marginTop: 0 }}
      keyboardType="number-pad"
      keyboardAppearance="light"
      renderCell={renderCell}
    />
  )
}

const styles = StyleSheet.create({
  textInput: {
    marginHorizontal: 0,
    height: 50,
    width: 50,
    lineHeight: 45,
    fontSize: 36,
    fontWeight: 900,
    textAlign: 'center',
    borderRadius: 8,
    color: '#449FE7',
    borderColor: '#e4e4e7',
    borderWidth: 1.5
  },
  focusedTextInput: {
    borderColor: '#449FE7',
    fontWeight: 300
  }
})
