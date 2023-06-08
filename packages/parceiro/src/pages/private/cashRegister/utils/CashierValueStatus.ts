export enum CashierValueStatus {
  MORE_MONEY = 'MORE_MONEY',
  LESS_MONEY = 'LESS_MONEY',
  EQUAL = 'EQUAL',
  CHANGE_IN_CASH = 'CHANGE_IN_CASH'
}

type CashRegisterStatusProperty = {
  [key in CashierValueStatus]?: string
}

export const cashRegisterStatusText: CashRegisterStatusProperty = {
  CHANGE_IN_CASH: 'Troco: ',
  EQUAL: 'Valor restante: ',
  LESS_MONEY: 'Valor restante: ',
  MORE_MONEY: 'Valor excedente: '
}

export const cashRegisterStatusColor: CashRegisterStatusProperty = {
  CHANGE_IN_CASH: 'green.500',
  EQUAL: undefined,
  LESS_MONEY: 'blue.500',
  MORE_MONEY: 'red.500'
}

export function getStatus(
  purchaseValue: number,
  paymentValue: number,
  canHasChange = false
): [number, CashierValueStatus] {
  const shortfall = Number((paymentValue - purchaseValue).toFixed(2))

  if (shortfall === 0) {
    return [shortfall, CashierValueStatus.EQUAL]
  }

  if (shortfall < 0) {
    return [shortfall, CashierValueStatus.LESS_MONEY]
  }

  if (canHasChange) {
    return [shortfall, CashierValueStatus.CHANGE_IN_CASH]
  }

  return [shortfall, CashierValueStatus.MORE_MONEY]
}
