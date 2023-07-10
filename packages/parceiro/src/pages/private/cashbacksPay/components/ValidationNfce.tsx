import React from 'react'

import { Badge } from '@chakra-ui/react'
import { NfceValidationStatus } from '../index'

interface ValidationNfceProps {
  nfceValidationStatus: NfceValidationStatus
}

export function ValidationNfce({ nfceValidationStatus }: ValidationNfceProps) {
  function getColorStatus() {
    switch (nfceValidationStatus) {
      case 'IN_PROGRESS':
        return 'orange'
      case 'NOT_FOUND':
        return 'red'
      case 'VALIDATED':
        return 'green'
      default:
        return ''
    }
  }

  function getColorText() {
    switch (nfceValidationStatus) {
      case 'IN_PROGRESS':
        return 'Em processamento'
      case 'NOT_FOUND':
        return 'Não encontrado'
      case 'VALIDATED':
        return 'Validado'
      default:
        return ''
    }
  }

  return <Badge colorScheme={getColorStatus()}>{getColorText()}</Badge>
}
