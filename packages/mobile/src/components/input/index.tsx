/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import {
  FormControl,
  IInputProps,
  Icon,
  Input,
  Pressable,
  Stack,
  WarningOutlineIcon
} from 'native-base'

export interface CustomInputProps extends IInputProps {
  isPassword?: boolean
  error?: string
  label: string
}

export function CustomInput(props: CustomInputProps) {
  const [secure, setSecure] = useState(true)

  return (
    <FormControl
      isRequired={props.isRequired}
      isDisabled={props.isDisabled}
      isInvalid={props.isInvalid}
      isReadOnly={props.isDisabled || props.isReadOnly}
    >
      <Stack>
        <FormControl.Label fontWeight="medium">{props.label}</FormControl.Label>
        <Input
          variant="underlined"
          placeholder=""
          fontSize="md"
          fontWeight="medium"
          borderColor="gray.600"
          isDisabled={props.isDisabled}
          isInvalid={props.isInvalid}
          pl="2"
          secureTextEntry={props.isPassword && secure}
          _focus={{
            borderColor: 'blue.600'
          }}
          InputRightElement={
            <Pressable
              display={props.isPassword ? 'flex' : 'none'}
              onPress={() => setSecure(!secure)}
            >
              <Icon
                as={Ionicons}
                name={secure ? 'eye-off-outline' : 'eye-outline'}
                size="xl"
                color="gray.600"
              />
            </Pressable>
          }
          {...props}
        />
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {props.error}
        </FormControl.ErrorMessage>
      </Stack>
    </FormControl>
  )
}
