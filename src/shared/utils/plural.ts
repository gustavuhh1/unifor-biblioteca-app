// Escolhe o singular quando `count` é 1 e o plural nos demais casos
// (ex.: "1 exemplar", "3 exemplares").
export function pluralize(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${count} ${count === 1 ? singular : plural}`
}
