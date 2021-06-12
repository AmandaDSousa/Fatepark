export function formatToBrazilianCurrency(number) {
  return new Intl
    .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(number)
}