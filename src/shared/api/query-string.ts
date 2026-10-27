// Monta a query string de uma rota GET (`?q=livro&page=2`), ignorando o que não
// tem valor. Devolve "" quando não sobra nenhum parâmetro.
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const parts = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
  return parts.length ? `?${parts.join('&')}` : ''
}
