export const currencyFormat = (value: number | undefined) => {
  return 'R$' + value?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
