import React from 'react'

import {
  Radio as NativeRadio,
  IRadioGroupProps,
  WarningOutlineIcon,
  FormControl,
  Stack
} from 'native-base'

interface Option {
  value: string
  text: string
}

interface RadioProps extends IRadioGroupProps {
  error?: string
  direction?: 'row' | 'column'
  options: Option[]
  label: string
  space?: number
}

export function Radio({
  error,
  label,
  direction = 'column',
  space = 2,
  options,
  value,
  ...rest
}: RadioProps) {
  return (
    <FormControl isInvalid={!!error}>
      <FormControl.Label fontWeight="medium">{label}</FormControl.Label>
      <NativeRadio.Group value={value || ''} {...rest}>
        <Stack direction={direction} space={space}>
          {options.map(option => (
            <NativeRadio key={option.value} value={option.value}>
              {option.text}
            </NativeRadio>
          ))}
        </Stack>
      </NativeRadio.Group>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {error}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
