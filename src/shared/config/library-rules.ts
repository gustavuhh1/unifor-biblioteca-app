// Limites do aluno (docs/escopo.md, regras de negócio; RF-EMP-02 e RF-FIL-03).

// Livros ao mesmo tempo (o pedido ainda não retirado conta).
export const MAX_ACTIVE_LOANS = 10

// Filas ao mesmo tempo, separado do limite de empréstimos.
export const MAX_ACTIVE_QUEUES = 7
