import { getInitials } from './getInitials'
import { dateFormat, dateFormatSimple } from './DateFormat'
import * as masks from './masks'
import { Linking } from 'react-native'
import { constants } from './constants'

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function sendWhatsAppMessage() {
  try {
    await Linking.openURL(constants.whatsAppLink)
  } catch {}
}

export async function sendIGreenMessage() {
  try {
    await Linking.openURL(constants.whatsAppLinkIGreen)
  } catch {}
}

export function hideCPF(cpf: string) {
  // Remove todos os caracteres não numéricos do CPF
  cpf = cpf.replace(/\D/g, '')

  // Máscara com asteriscos
  const mask = '***.***.***-'

  // Obtém os últimos dois dígitos do CPF
  const lastDigits = cpf.slice(-2)

  // Adiciona os asteriscos na máscara, deixando apenas os dois últimos dígitos visíveis
  return mask + lastDigits
}

export { getInitials, masks, dateFormat, dateFormatSimple }
