import { Text, View } from 'react-native'
import TelaBase from '@/shared/components/tela-base'
import { FineCard } from '@/shared/components/fine-card'
import { Caixa, Linha } from '@/shared/components/blocos'
import { Button, Icon } from '@/shared/components'

export function MyFinesScreen({ estado = 'atraso', onVoltar, onDetalhar, onSelecionarAba }: {
  estado?: 'atraso' | 'detalhes' | 'congelada'; onVoltar?: () => void; onDetalhar?: () => void; onSelecionarAba?: (index: number) => void
}) {
  const frozen = estado === 'congelada'
  const detail = estado === 'detalhes'
  return <TelaBase titulo={frozen ? 'Multa em aberto' : detail ? 'Multa' : 'Multa por atraso'} interna onVoltar={onVoltar} aba={detail ? 'perfil' : undefined} onSelecionarAba={onSelecionarAba}>
    <FineCard frozen={frozen} />
    {detail ? <><Text className="text-title-sm text-ink">Como a multa é calculada</Text><Caixa><Linha esquerda="Venceu em" direita="10/10" /><Linha esquerda="Dias úteis de atraso" direita="3 dias" /><Linha esquerda="Valor por dia útil" direita="R$ 2,00" /><Linha esquerda="Total até hoje" direita="R$ 6,00" /></Caixa><Text className="text-caption text-ink-muted">Fim de semana, feriado e recesso não contam. A multa para de crescer quando o livro é devolvido.</Text></> : <>
      <Caixa tom={frozen ? 'brand' : 'aviso'}><View className="flex-row gap-2"><Icon name={frozen ? 'info' : 'alert'} color={frozen ? 'brand' : 'warning'} /><Text className="flex-1 text-label text-ink">{frozen ? 'A multa parou de contar' : 'A multa sobe R$ 2,00 por dia útil'}</Text></View><Text className="text-body text-ink">{frozen ? 'Você devolveu o livro, então o valor não sobe mais. Você já pode pegar livros e entrar em filas.' : 'Amanhã (sex) passa para R$ 8,00. A contagem para quando você devolver o livro.'}</Text></Caixa>
      <Text className="text-overline text-ink-muted">Como resolver</Text><Caixa>{!frozen ? <><Text className="text-label text-ink">1 · Devolva Cálculo, Vol. 1 no balcão</Text><Text className="text-body text-ink-muted">A multa para de contar e o bloqueio para novos empréstimos termina na hora.</Text></> : null}<Text className="text-label text-ink">{frozen ? '1' : '2'} · Pague R$ 6,00 na biblioteca</Text><Text className="text-body text-ink-muted">Só presencialmente, no balcão. O bibliotecário registra o pagamento.</Text></Caixa>
      {!frozen ? <Button block variant="secondary" onPress={onDetalhar}>Como a multa é calculada</Button> : null}
    </>}
    <Text className="text-overline text-ink-muted">Atendimento</Text><Caixa><Text className="text-body text-ink">Biblioteca (Praça Central)</Text><Text className="text-body text-ink-muted">Seg a sex, 7h às 21h55 · sáb, 8h às 14h10</Text><Text className="text-body text-ink-muted">BiblioZap (85) 3477-3257</Text></Caixa>
  </TelaBase>
}
