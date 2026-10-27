// Valor em centavos (como a API manda) escrito como dinheiro: 600 → "R$ 6,00".
export function formatCents(cents: number): string {
  const reais = Math.trunc(Math.abs(cents) / 100)
  const rest = String(Math.abs(cents) % 100).padStart(2, '0')
  const grouped = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${cents < 0 ? '-' : ''}R$ ${grouped},${rest}`
}
