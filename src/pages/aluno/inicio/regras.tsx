import { useState } from 'react'
import { Linking, Text } from 'react-native'
import TelaBase from '@/shared/components/tela-base'
import { Button } from '@/shared/components'
import { Caixa } from '@/shared/components/blocos'

const secoes = [
  ['Empréstimo', 'Até 10 livros ao mesmo tempo.\n14 dias para devolver cada livro.\nNão dá para pegar dois exemplares do mesmo título, nem outra edição dele.'],
  ['Retirada', 'Pedido feito: retire no balcão em até 2 dias úteis.\nMostre o QR do pedido. Sem celular? Informe a matrícula ou o código do pedido.'],
  ['Fila (reserva)', 'Só abre quando todos os exemplares da edição estão emprestados.\nAté 7 filas ao mesmo tempo. Cada edição marcada conta como uma.\nNa sua vez: 24h para confirmar e 2 dias úteis para retirar. Se perder um prazo, você sai da fila e o próximo é avisado.'],
  ['Renovação', 'Uma única vez por empréstimo, por mais 14 dias, dentro do prazo, se o livro não estiver atrasado e ninguém estiver na fila.\nPelo app, pelo Unifor Online ou no balcão.'],
  ['Atraso e multa', 'R$ 2,00 por dia útil de atraso, por livro.\nCom livro atrasado, você não pode pedir, entrar em fila nem retirar até devolver.\nNa devolução a multa para de contar e fica em aberto até ser paga.\nPagamento só presencial, no balcão da biblioteca. O app não recebe pagamentos.'],
  ['Perda ou dano', 'Você repõe o livro e ainda paga a multa do atraso, se houver. O app só informa esta regra. A reposição é combinada no balcão.'],
  ['Fins de semana e feriados', 'Prazos em dias úteis não contam fins de semana, feriados (nacionais, do Ceará e de Fortaleza) nem dias de recesso da Unifor.\nSe o prazo cair num feriado, ele passa para o próximo dia útil.'],
  ['Atendimento', 'Biblioteca (Praça Central).\nSeg a sex, 7h às 21h55 · sáb, 8h às 14h10.\nBiblioZap (85) 3477-3257 · Empréstimo (85) 3477-3162.\nbibemprestimo@unifor.br'],
]
export default function Regras({ onVoltar }: { onVoltar?: () => void }) {
  const [erro, setErro] = useState('')
  return <TelaBase titulo="Regras da biblioteca" interna onVoltar={onVoltar}>
    <Text className="text-body text-ink-muted">Para alunos de graduação</Text>
    {secoes.map(([title, text]) => <Caixa key={title}><Text className="text-label text-ink">{title}</Text><Text className="text-body text-ink-muted">{text}</Text></Caixa>)}
    <Button block variant="secondary" icon="externalLink" onPress={() => { Linking.openURL('https://unifor.br/cesta-de-servicos/biblioteca').catch(() => setErro('Não foi possível abrir a página. Confira sua conexão.')) }}>Abrir página oficial da biblioteca</Button>
    {erro ? <Text accessibilityRole="alert" className="text-caption text-danger">{erro}</Text> : null}
  </TelaBase>
}
