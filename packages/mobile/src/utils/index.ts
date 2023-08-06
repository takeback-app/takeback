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

export async function createWhatsAppMessage(number: string) {
  try {
    await Linking.openURL(
      `whatsapp://send?text=Ol%C3%A1%2C+vim+pelo+app+da+Takeback+e+gostaria+de+fazer+um+pedido.&phone=55${number}`
    )
  } catch {}
}

export async function createWhatsAppReferralMessage(number: string) {
  const text = `Convido você para baixar o Takeback e experimentar uma nova forma de valorizar o seu dinheiro 💴.  Para isso, basta digitar Takeback na sua loja de aplicativos ou clicar nos links abaixo:\n\nLink para Android 👉🏻 https://play.google.com/store/apps/details?id=com.takeback\n\nLink para iPhone 👉🏻 https://apps.apple.com/br/app/takeback/id1617475702\n\nÉ gratuito e sempre será!\nTop demais 🤩😉`

  try {
    await Linking.openURL(`whatsapp://send?text=${text}&phone=55${number}`)
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
