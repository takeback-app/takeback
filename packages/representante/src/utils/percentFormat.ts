export const percentFormat = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2
  }).format(value || 0)
