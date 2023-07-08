import { NFCePaymentMethod } from '@prisma/client'

const paymentMethods = {
  1: NFCePaymentMethod.CASH,
  2: NFCePaymentMethod.BANK_CHECK,
  3: NFCePaymentMethod.CREDIT,
  4: NFCePaymentMethod.DEBIT,
  5: NFCePaymentMethod.STORE_CREDIT,
  10: NFCePaymentMethod.FOOD_VOUCHER,
  11: NFCePaymentMethod.MEAL_VOUCHER,
  12: NFCePaymentMethod.GIFT_VOUCHER,
  13: NFCePaymentMethod.FUEL_VOUCHER,
  15: NFCePaymentMethod.BANK_PAYMENT_SLIP,
  16: NFCePaymentMethod.BANK_DEPOSIT,
  17: NFCePaymentMethod.PIX,
  18: NFCePaymentMethod.BANK_TRANSFER,
  19: NFCePaymentMethod.CASHBACK,
  90: NFCePaymentMethod.NO_PAYMENT,
  99: NFCePaymentMethod.OTHER,
}

export function getNFCePaymentMethod(tPag: number): NFCePaymentMethod {
  return paymentMethods[tPag]
}
