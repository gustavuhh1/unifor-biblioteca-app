import { useReducedMotion } from '@/shared/theme/use-reduced-motion'
import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppBar } from '@/shared/components/app-bar'
import { BottomNav } from '@/shared/components/bottom-nav'
import { CapaLivro } from '@/shared/components/livro'
import { Icon } from '@/shared/components/icon'
import { Button } from '@/shared/components/button'
import { useTheme } from '@/shared/theme/theme-provider'

export type EstadoFilaLivro = 'normal' | 'gerenciar' | 'adicionar' | 'confirmar-posicao' | 'posicao-atualizada' | 'remover'
export type AlunoDaFila = { id: string; nome: string; matricula: string; iniciais: string; data: string }
export interface FilaLivroProps {
  estado?: EstadoFilaLivro
  onVoltar?: () => void
  onSelecionarAba?: (indice: number) => void
  onAdicionarAluno?: (matricula: string, posicao: number, motivo: string) => void
  onMoverAluno?: (id: string, posicao: number) => void
  onRemoverAluno?: (id: string, motivo: string) => void
}
const iniciais: AlunoDaFila[] = [
  { id: 'ana', nome: 'Ana Beatriz Lima', matricula: '2311047', iniciais: 'AB', data: 'desde 02/10' },
  { id: 'lucas', nome: 'Lucas Almeida', matricula: '2412858', iniciais: 'LA', data: 'desde 08/10' },
  { id: 'carlos', nome: 'Carlos Eduardo Sá', matricula: '2210933', iniciais: 'CS', data: 'desde 10/10' },
  { id: 'marina', nome: 'Marina Castro', matricula: '2513320', iniciais: 'MC', data: 'desde 09/10' },
]
const paula: AlunoDaFila = { id: 'paula', nome: 'Paula Ribeiro', matricula: '2311998', iniciais: 'PR', data: 'desde hoje' }

export default function FilaLivro({ estado = 'normal', onVoltar, onSelecionarAba, onAdicionarAluno, onMoverAluno, onRemoverAluno }: FilaLivroProps) {
  const reducedMotion = useReducedMotion()

  const safe = useSafeAreaInsets()
  const { colors } = useTheme()
  const [painel, setPainel] = useState<EstadoFilaLivro>(estado)
  const [alunos, setAlunos] = useState<AlunoDaFila[]>(estado === 'posicao-atualizada' ? [...iniciais, paula] : iniciais)
  const [selecionado, setSelecionado] = useState<AlunoDaFila>(iniciais[2])
  const [matricula, setMatricula] = useState(paula.matricula)
  const [posicao, setPosicao] = useState(estado === 'confirmar-posicao' ? 1 : 5)
  const [tipoAlteracao, setTipoAlteracao] = useState<'incluir' | 'mover'>('incluir')
  const [motivo, setMotivo] = useState('Pedido no balcão, sem acesso ao app')
  const [mensagem, setMensagem] = useState(estado === 'posicao-atualizada' ? 'Paula entrou em 5º e foi avisada.' : '')
  const modal = ['gerenciar','adicionar','confirmar-posicao','remover'].includes(painel)

  const [erro, setErro] = useState('')
  const prevista = (() => {
    const aluno = tipoAlteracao === 'mover' ? selecionado : paula
    const copia = alunos.filter(a => a.id !== aluno.id)
    copia.splice(posicao - 1, 0, aluno)
    return copia
  })()
  function voltar() { setPainel('normal') }
  function adicionar() {
    if (!/^\d{7}$/.test(matricula.trim()) || !motivo.trim()) { setErro('Informe matrícula de 7 dígitos e motivo.'); return }
    if (alunos.some(a => a.matricula === matricula.trim() || a.id === 'paula')) { setErro('Este aluno já está na fila.'); return }
    if (matricula.trim() !== paula.matricula) { setErro('Aluno não encontrado nesta demonstração.'); return }
    setErro('')
    const destino = Math.max(1, Math.min(alunos.length + 1, posicao))
    if (destino < alunos.length + 1) { setTipoAlteracao('incluir'); setPainel('confirmar-posicao'); return }
    const novo = { ...paula, matricula: matricula.trim() }
    setAlunos(lista => [...lista.filter(a => a.id !== 'paula'), novo])
    setMensagem(`${novo.nome} entrou em ${destino}º na fila`)
    onAdicionarAluno?.(novo.matricula, destino, motivo)
    voltar()
  }
  function confirmarMover() {
    if (!motivo.trim()) { setErro('Informe o motivo da alteração.'); return }
    const destino = Math.max(1, Math.min(alunos.length + (tipoAlteracao === 'incluir' ? 1 : 0), posicao))
    const aluno = tipoAlteracao === 'mover' ? selecionado : { ...paula, matricula: matricula.trim() }
    setAlunos(lista => {
      const copia = lista.filter(a => a.id !== aluno.id)
      copia.splice(destino - 1, 0, aluno)
      return copia
    })
    setMensagem(`${aluno.nome} está em ${destino}º na fila`)
    if (tipoAlteracao === 'mover') onMoverAluno?.(aluno.id, destino)
    else onAdicionarAluno?.(aluno.matricula, destino, motivo)
    voltar()
  }
  function remover() {
    if (!motivo.trim()) return
    setAlunos(lista => lista.filter(a => a.id !== selecionado.id))
    onRemoverAluno?.(selecionado.id, motivo)
    setMensagem('Aluno removido da fila (simulação)')
    voltar()
  }
  return <View className="flex-1 bg-surface">
    <AppBar title="Fila do livro" subtitle={`${alunos.length} alunos aguardando`} back onBack={onVoltar}/>
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
      <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-3"><CapaLivro nome="Arquitetura Limpa" cor="cover6" largura={72}/><View className="flex-1 gap-2"><Text className="text-label text-ink">Arquitetura Limpa</Text><Text className="text-caption text-ink-muted">Robert C. Martin · devolve 21/10</Text><View className="self-start rounded-pill bg-warning-soft px-2 py-1"><Text className="text-caption text-warning">Emprestado</Text></View></View></View>
      <View className="flex-row gap-3 rounded-md bg-brand-soft p-4"><Icon name="info" color="brand" size={19}/><Text className="flex-1 text-body text-ink">Fila automática. Quando o livro volta, o 1º da fila é avisado e tem 24h para confirmar. Mais de um exemplar pode atender alunos diferentes.</Text></View>
      <View className="overflow-hidden rounded-md border border-line bg-surface-raised">
        {alunos.map((aluno, i) => <Pressable key={aluno.id} onPress={() => { setSelecionado(aluno); setPosicao(i + 1); setTipoAlteracao('mover'); setPainel('gerenciar') }} accessibilityRole="button" accessibilityLabel={`Gerenciar ${aluno.nome}, posição ${i + 1}`} className="flex-row items-center gap-2 border-b border-line p-3">
          <Text className="w-4 text-center text-caption text-ink-muted">{i + 1}</Text><View className="h-10 w-10 items-center justify-center rounded-pill bg-brand-soft"><Text className="text-caption-strong text-brand">{aluno.iniciais}</Text></View><View className="flex-1 gap-1"><Text className="text-label text-ink">{aluno.nome}</Text><Text className="text-caption text-ink-muted">{aluno.matricula} · {aluno.data}</Text></View><Text className="text-title text-ink-muted">⋮</Text>
        </Pressable>)}
      </View>
      <Button block variant="secondary" icon="plus" onPress={() => { setTipoAlteracao('incluir'); setPosicao(alunos.length + 1); setPainel('adicionar') }}>Adicionar aluno à fila</Button>
    </ScrollView>
    {mensagem && !modal ? <Pressable onPress={() => setMensagem('')} className="absolute bottom-[80px] left-4 right-4 flex-row items-center gap-2 rounded-md bg-ink p-4"><Icon name="check" color="surface" size={18}/><Text className="flex-1 text-caption-strong text-surface">{mensagem}</Text><Icon name="x" color="onCover" size={15}/></Pressable> : null}
    <BottomNav role="bibliotecario" active={3} onSelect={onSelecionarAba}/>
    <Modal transparent visible={modal} animationType={reducedMotion ? "none" : "slide"} onRequestClose={voltar}>
      <View className="flex-1 justify-end"><Pressable className="absolute inset-0" style={{ backgroundColor: colors.scrim }} onPress={voltar} accessibilityLabel="Fechar"/>
        <View className="max-h-[88%] rounded-t-sheet bg-surface-raised p-4" style={{ paddingBottom: Math.max(safe.bottom, 16) }}><View className="mb-4 items-center"><View className="h-1 w-[36px] rounded-pill bg-line-strong" /></View><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 15, paddingBottom: 4 }}>
          {erro ? <Text accessibilityRole="alert" className="text-caption text-danger">{erro}</Text> : null}
          {painel === 'remover' ? <>
            <Text className="text-title text-ink">Remover {selecionado.nome} da fila?</Text>
            <Text className="text-body text-ink-muted">Motivo: {motivo || 'Informe o motivo antes de confirmar.'}</Text>
            <Button block variant="danger" disabled={!motivo.trim()} onPress={remover}>Confirmar remoção</Button>
            <Button block variant="ghost" onPress={() => setPainel('gerenciar')}>Cancelar</Button>
          </> : painel === 'gerenciar' ? <>
            <Text className="text-title text-ink">{selecionado.nome}</Text><Text className="text-body text-ink-muted">{alunos.findIndex(a => a.id === selecionado.id) + 1}º na fila · matrícula {selecionado.matricula}</Text>
            <View className="flex-row flex-wrap gap-2">{alunos.map((a, i) => <Pressable key={a.id} accessibilityRole="button" accessibilityLabel={`Mover para ${i + 1}`} onPress={() => setPosicao(i + 1)} className={`min-h-[44px] justify-center rounded-pill border px-3 ${posicao === i + 1 ? 'border-brand bg-brand-soft' : 'border-line bg-surface'}`}><Text className="text-caption-strong text-ink">{i + 1}º</Text></Pressable>)}</View><Button block variant="secondary" onPress={() => { setTipoAlteracao('mover'); setMatricula(selecionado.matricula); setPainel('confirmar-posicao') }}>Mudar posição</Button>
            <Button block variant="secondary" onPress={() => { setMensagem('Aviso reenviado (simulação)'); voltar() }}>Reenviar aviso</Button>
            <Text className="text-label text-ink">Motivo para remoção</Text><TextInput value={motivo} onChangeText={setMotivo} multiline className="min-h-[64px] rounded-md border border-line bg-surface p-3 text-body text-ink"/>
            <Button block variant="danger" onPress={() => setPainel('remover')}>Remover da fila</Button><Button block variant="ghost" onPress={voltar}>Fechar</Button>
          </> : painel === 'adicionar' ? <>
            <Text className="text-title text-ink">Adicionar aluno à fila</Text><Text className="text-caption text-ink-muted">Arquitetura Limpa · {alunos.length} alunos aguardando</Text>
            <Text className="text-label text-ink">Matrícula</Text><TextInput value={matricula} onChangeText={setMatricula} maxLength={7} keyboardType="number-pad" className="min-h-12 rounded-md border border-line bg-surface px-3 text-body text-ink"/>
            <View className="flex-row items-center gap-3 rounded-md bg-surface-sunken p-3"><View className="h-10 w-10 items-center justify-center rounded-pill bg-brand-soft"><Text className="text-caption-strong text-brand">PR</Text></View><View className="flex-1"><Text className="text-label text-ink">Paula Ribeiro</Text><Text className="text-caption text-ink-muted">Aluno encontrado · demonstrativo</Text></View><Icon name="checkCircle" color="success"/></View>
            <Text className="text-label text-ink">Posição</Text><View className="flex-row flex-wrap gap-2">{Array.from({ length: alunos.length + 1 }, (_, i) => i + 1).map(n => <Pressable key={n} onPress={() => setPosicao(n)} className={`min-h-10 justify-center rounded-pill border px-3 ${n === posicao ? 'border-brand bg-brand-soft' : 'border-line bg-surface'}`}><Text className={n === posicao ? 'text-caption-strong text-brand' : 'text-caption text-ink'}>{n === alunos.length + 1 ? `No fim (${n}º)` : `${n}º`}</Text></Pressable>)}</View>
            <Text className="text-label text-ink">Motivo (obrigatório)</Text><TextInput multiline value={motivo} onChangeText={setMotivo} className="min-h-[64px] rounded-md border border-line bg-surface p-3 text-body text-ink"/>
            <Button block disabled={!/^\d{7}$/.test(matricula.trim()) || !motivo.trim()} onPress={adicionar}>Adicionar na fila</Button><Button block variant="ghost" onPress={voltar}>Cancelar</Button>
          </> : <>
            <Text className="text-title text-ink">{tipoAlteracao === 'mover' ? `Mover ${selecionado.nome} para o início da fila?` : `Adicionar ${paula.nome} à frente da fila?`}</Text><Text className="text-body text-ink-muted">A nova posição será {posicao}º. Os demais alunos poderão descer uma posição e serão avisados pelo sistema.</Text>
            <View className="gap-2 rounded-md border border-line bg-surface p-4"><Text className="text-label text-ink">Impacto na ordem</Text>{alunos.filter(a => prevista.findIndex(p => p.id === a.id) !== alunos.findIndex(p => p.id === a.id)).map((a) => <View key={a.id} className="flex-row justify-between"><Text className="text-caption text-ink">{a.nome}</Text><Text className="text-caption-strong text-danger">{alunos.findIndex(p => p.id === a.id) + 1}º → {prevista.findIndex(p => p.id === a.id) + 1}º</Text></View>)}</View>
            <View className="flex-row gap-2 rounded-md bg-danger-soft p-4"><Icon name="alert" color="danger"/><Text className="flex-1 text-body text-ink">Alterar a ordem da fila afeta os demais alunos. Confirme apenas quando houver justificativa.</Text></View>
            <Text className="text-label text-ink">Motivo obrigatório</Text><TextInput accessibilityLabel="Motivo da alteração" value={motivo} onChangeText={setMotivo} multiline className="min-h-[64px] rounded-md border border-line bg-surface p-3 text-body text-ink"/><Button block variant="danger" disabled={!motivo.trim()} onPress={confirmarMover}>Colocar à frente mesmo assim</Button><Button block variant="ghost" onPress={() => { setTipoAlteracao('incluir'); setPosicao(alunos.length + 1); setPainel('adicionar') }}>Voltar e colocar no fim</Button>
          </>}
        </ScrollView></View>
      </View>
    </Modal>
  </View>
}
