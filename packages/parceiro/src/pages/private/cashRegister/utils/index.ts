import { unMaskCurrency } from '../../../../utils/masks'

export * from './CashierValueStatus'

interface FoundIds {
  [key: string | number]: boolean
}

interface Item {
  [key: string]: string | number
}

interface BaseMethod {
  id: number
  description: string
}

interface SelectedMethod {
  id: number
  value: number
}

export function checkDuplicity(array: Item[], key: string) {
  const foundIds = {} as FoundIds

  for (let i = 0; i < array.length; i++) {
    if (foundIds[array[i][key]]) {
      return true
    }

    foundIds[array[i][key]] = true
  }

  return false
}

export function sumMethods(methods: { value: number | string }[]) {
  return methods?.reduce((a, v) => a + unMaskCurrency(v.value), 0)
}

export function hasMethodByDescription(
  selectedMethods: SelectedMethod[],
  baseMethods: BaseMethod[],
  description: string
): boolean {
  const descriptionMethod = baseMethods.find(m => m.description === description)

  if (!descriptionMethod) {
    throw new Error('Sistema não configurado')
  }

  return !!selectedMethods.find(m => m.id === descriptionMethod.id)
}
