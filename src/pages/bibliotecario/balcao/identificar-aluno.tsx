import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppBar, Button, TextField } from '@/shared/components'
import { Caixa } from '@/shared/components/blocos'
export interface IdentificarAlunoProps { onVoltar?: () => void; onDevolucao?: () => void; onRetirada?: () => void }
export default function IdentificarAluno({ onVoltar, onDevolucao, onRetirada }: IdentificarAlunoProps) {
  const safe = useSafeAreaInsets()
  const [matricula, setMatricula] = useState('2513320')
  const [aluno, setAluno] = useState<'marina' | 'beatriz' | null>('marina')
  const [erro, setErro] = useState('')
  function buscar() {
    const valor = matricula.trim().toUpperCase()
    if (!/^(\d{7}|RET-\d{4})$/.test(valor)) { setErro('Informe uma matrícula de 7 dígitos ou um código RET-0000.'); setAluno(null); return }
    const encontrado = valor === '2513320' ? 'marina' : valor === '2311052' || valor === 'RET-4817' ? 'beatriz' : null
    setAluno(encontrado); setErro(encontrado ? '' : 'Aluno não encontrado nesta demonstração.')
  }
  const marina = aluno === 'marina'
  return <View className="flex-1 bg-surface"><AppBar title="Identificar aluno" subtitle="Sem QR: pela matrícula ou código" back onBack={onVoltar} /><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
    <TextField label="Matrícula ou código do pedido" icon="search" value={matricula} onChangeText={value => { setMatricula(value); setAluno(null); setErro('') }} onSubmitEditing={buscar} returnKeyType="search" hint="Ex.: 2513320 ou RET-4817" error={erro || undefined} />
    <Button block variant="secondary" onPress={buscar}>Buscar aluno</Button>
    {aluno ? <>
      <Caixa><Text className="text-title-sm text-ink">{marina ? 'Marina Castro' : 'Beatriz Nogueira'}</Text><Text className="text-caption text-ink-muted">{marina ? '2513320 · Sistemas de Informação' : '2311052 · Aluna em dia'}</Text><Text className="text-overline text-brand">{marina ? '3 de 10 livros · 1 atrasado' : 'Pedido pronto para retirar'}</Text></Caixa>
      {marina ? <><Caixa tom="erro"><Text className="text-label text-danger">Empréstimos bloqueados</Text><Text className="text-body text-ink">Marina tem 1 livro em atraso: Cálculo, Vol. 1 (3 dias, multa de R$ 6,00). Registre a devolução; até lá ela não pode pedir nem retirar livros.</Text></Caixa><Text className="text-overline text-ink-muted">Com o aluno</Text><Caixa>{[['Cálculo, Vol. 1', '3 dias de atraso'], ['Engenharia de Software', 'vence 16/10'], ['Estruturas de Dados e Algoritmos', 'vence 23/10']].map(([title, due]) => <View key={title} className="flex-row justify-between gap-3"><Text className="flex-1 text-book-title-sm text-ink">{title}</Text><Text className="text-caption text-ink-muted">{due}</Text></View>)}</Caixa></> : <Caixa tom="sucesso"><Text className="text-label text-success">Pedido confirmado e sem pendências</Text><Text className="text-body text-ink">Padrões de Projeto · RET-4817</Text></Caixa>}
    </> : null}
  </ScrollView>{aluno ? <View className="border-t border-line bg-surface-raised px-4 pt-3" style={{ paddingBottom: Math.max(safe.bottom, 16) }}><Button block onPress={marina ? onDevolucao : onRetirada}>{marina ? 'Registrar devolução de Cálculo, Vol. 1' : 'Consultar retirada'}</Button></View> : null}</View>
}