import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Container, Label } from './styles'

interface Props {
  name: string
  label: string
  max?: number
  fileSelected?: boolean
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

const InputFile: React.FC<React.PropsWithChildren<Props>> = ({
  name,
  onChange,
  label,
  fileSelected
}) => {
  const inputRef = useRef(null)
  const { fieldName, registerField } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'files[0]'
    })
  }, [fieldName, registerField])

  return (
    <Container>
      <input
        type="file"
        id="file"
        ref={inputRef}
        name="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <Label htmlFor="file" fileSelected={fileSelected}>
        {label}
      </Label>
    </Container>
  )
}

export default InputFile
