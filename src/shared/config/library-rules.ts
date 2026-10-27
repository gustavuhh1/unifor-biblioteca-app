// Limites do aluno (docs/escopo.md, regras de negócio; RF-EMP-02 e RF-FIL-03).

// Livros ao mesmo tempo (o pedido ainda não retirado conta).
export const MAX_ACTIVE_LOANS = 10

// Filas ao mesmo tempo, separado do limite de empréstimos.
export const MAX_ACTIVE_QUEUES = 7

// Dias de cada empréstimo; a única renovação dá mais este tanto (RF-EMP-09).
export const LOAN_PERIOD_DAYS = 14

// Dias úteis para retirar um pedido no balcão (RF-EMP-01 e RF-FIL-06).
export const PICKUP_BUSINESS_DAYS = 2

// Horas corridas que o 1º da fila tem para confirmar a vez (RF-FIL-06).
export const QUEUE_CONFIRM_HOURS = 24
