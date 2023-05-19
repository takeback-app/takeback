import React from 'react'

import moment from 'moment'
import { useDisclose } from 'native-base'
import { Control, Controller } from 'react-hook-form'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { UpdateAccountData } from '../FieldsPage'
import { CustomInput } from '../../../../components/input'

interface BirthdayInputProps {
  control: Control<UpdateAccountData>
}

export function BirthdayInput({ control }: BirthdayInputProps) {
  const { isOpen, onClose, onOpen } = useDisclose()

  return (
    <Controller
      control={control}
      rules={{ required: 'O campo é obrigatório' }}
      name="birthday"
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }
      }) => (
        <>
          <CustomInput
            label="Data de Nascimento"
            keyboardType="numeric"
            maxLength={10}
            onBlur={onBlur}
            onFocus={onOpen}
            isInvalid={!!error?.message}
            error={error?.message}
            value={value}
          />
          <DateTimePickerModal
            isVisible={isOpen}
            themeVariant="light"
            mode="date"
            date={value ? moment(value, 'DD/MM/YYYY').toDate() : undefined}
            onConfirm={date => {
              onChange(moment(date).format('DD/MM/YYYY'))
              onClose()
            }}
            onCancel={onClose}
          />
        </>
      )}
    />
  )
}
