// Chave do TanStack Query das multas do aluno (GET /me/fines).
export const MY_FINES_QUERY_KEY = ['my-fines'] as const

// Avisos do topo de Minhas multas (RF-MUL-04): atraso bloqueia; multa em aberto
// sem atraso só avisa.
export const MY_FINES_NOTICE = {
  blocked: {
    title: 'Empréstimos bloqueados',
    text: 'Você tem livro em atraso. Devolva o livro para voltar a pedir, entrar em filas e retirar. A multa é paga só no balcão da biblioteca.',
  },
  openOnly: {
    title: 'Multa em aberto',
    text: 'O livro já foi devolvido, então o valor não sobe mais. Você pode continuar pegando livros e entrando em filas. A multa é paga só no balcão da biblioteca.',
  },
} as const
