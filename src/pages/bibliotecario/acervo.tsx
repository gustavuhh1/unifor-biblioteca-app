import { useState } from 'react'
import { Pressable, ScrollView, Switch, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppBar, BottomNav, Button, TextField } from '@/shared/components'
import { CapaLivro } from '@/shared/components/livro'
import { Caixa } from '@/shared/components/blocos'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { useTheme } from '@/shared/theme/theme-provider'

type Modo = 'lista' | 'novo' | 'editar' | 'pausado' | 'atualizar' | 'remover'
type Livro = { id: number; titulo: string; autor: string; isbn: string; exemplares: number; fila: number; emprestado: boolean; pausado: boolean }
const originais: Livro[] = [
  { id: 1, titulo: 'Código Limpo: habilidades práticas do Agile Software', autor: 'Robert C. Martin', isbn: '978-85-7608-267-5', exemplares: 3, fila: 1, emprestado: true, pausado: false },
  { id: 2, titulo: 'O Codificador Limpo', autor: 'Robert C. Martin', isbn: '', exemplares: 2, fila: 0, emprestado: false, pausado: false },
  { id: 3, titulo: 'Arquitetura Limpa', autor: 'Robert C. Martin', isbn: '', exemplares: 1, fila: 4, emprestado: true, pausado: true },
]
export default function AcervoBibliotecario({ estado = 'lista', onVoltar, onSelecionarAba }: {
  estado?: Modo; onVoltar?: () => void; onSelecionarAba?: (indice: number) => void
}) {
  const safe = useSafeAreaInsets()
  const { colors } = useTheme()
  const [modo, setModo] = useState<Modo>(estado)
  const [livros, setLivros] = useState(originais)
  const [selecionado, setSelecionado] = useState(estado === 'remover' ? 2 : 1)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [isbn, setIsbn] = useState(estado === 'novo' ? '9786586057124' : originais[0].isbn)
  const [titulo, setTitulo] = useState(estado === 'novo' ? '' : originais[0].titulo)
  const [autor, setAutor] = useState(estado === 'novo' ? '' : originais[0].autor)
  const [editora, setEditora] = useState(estado === 'novo' ? '' : 'Alta Books')
  const [edicao, setEdicao] = useState(estado === 'novo' ? '' : '1ª')
  const [ano, setAno] = useState(estado === 'novo' ? '' : '2011')
  const [cdu, setCdu] = useState(estado === 'novo' ? '' : '005.1')
  const [cutter, setCutter] = useState(estado === 'novo' ? '' : 'M386c')
  const [estante, setEstante] = useState(estado === 'novo' ? '' : 'Estante 005.1')
  const [exemplares, setExemplares] = useState(estado === 'novo' ? '' : '3')
  const [pausado, setPausado] = useState(estado === 'pausado')
  const [erroIsbn, setErroIsbn] = useState(estado === 'novo')
  const [tentou, setTentou] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const alvo = livros.find(l => l.id === selecionado) ?? originais[0]
  const normalizar = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const resultados = livros.filter(l => normalizar(`${l.titulo} ${l.autor} ${l.isbn}`).includes(normalizar(busca.trim())) && (filtro === 'Todos' || filtro === 'Emprestados' && l.emprestado || filtro === 'Sem ISBN' && !l.isbn || filtro === 'Com fila' && l.fila > 0))
  function editar(livro?: Livro) {
    setSelecionado(livro?.id ?? 0); setIsbn(livro?.isbn ?? ''); setTitulo(livro?.titulo ?? ''); setAutor(livro?.autor ?? '')
    setEditora(livro ? 'Alta Books' : ''); setEdicao(livro ? '1ª' : ''); setAno(livro ? '2011' : '')
    setCdu(livro ? '005.1' : ''); setCutter(livro ? 'M386c' : ''); setEstante(livro ? 'Estante 005.1' : '')
    setExemplares(livro ? String(livro.exemplares) : ''); setPausado(livro?.pausado ?? false)
    setTentou(false); setErroIsbn(false); setMensagem(''); setModo(livro ? 'editar' : 'novo')
  }
  function salvar() {
    setTentou(true)
    if (!titulo.trim() || !autor.trim() || !editora.trim() || !/^\d{4}$/.test(ano) || !/^\d+$/.test(exemplares) || Number(exemplares) < 1 || !cdu.trim() || !cutter.trim() || !estante.trim()) return
    const dados = { ...alvo, id: selecionado || Date.now(), titulo: titulo.trim(), autor: autor.trim(), isbn, exemplares: Number(exemplares), pausado, ...(selecionado ? {} : { fila: 0, emprestado: false }) }
    setLivros(lista => selecionado ? lista.map(l => l.id === selecionado ? dados : l) : [...lista, dados])
    setModo('lista'); setMensagem('Cadastro salvo nesta demonstração. Nenhuma alteração foi enviada ao servidor.')
  }
  function remover() {
    if (alvo.emprestado || alvo.fila) { setMensagem('Só dá para remover livros sem exemplar emprestado e sem fila. Marque Indisponível para novos pedidos.'); return }
    setModo('remover')
  }
  const lista = modo === 'lista' || modo === 'remover'
  const externo = modo === 'atualizar'
  return <View className="flex-1 bg-surface">
    <AppBar title={lista ? 'Acervo' : externo ? 'Atualizar pelas fontes externas' : modo === 'novo' ? 'Novo livro' : 'Editar livro'} subtitle={lista ? 'Gestão dos livros da biblioteca' : externo || modo !== 'novo' ? alvo.titulo : 'Cadastro no acervo'} back onBack={lista ? onVoltar : () => setModo('lista')} actions={lista ? [{ icon: 'plus', label: 'Novo livro', onPress: () => editar() }] : modo !== 'novo' && !externo ? [{ icon: 'trash', label: 'Remover livro', onPress: remover }] : []} />
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
      {mensagem ? <Text accessibilityLiveRegion="polite" className="rounded-md bg-brand-soft p-3 text-body text-ink">{mensagem}</Text> : null}
      {lista ? <>
        <TextField label="Buscar título, autor ou ISBN" icon="search" value={busca} onChangeText={setBusca} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{['Todos', 'Emprestados', 'Sem ISBN', 'Com fila'].map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: filtro === item }} onPress={() => setFiltro(item)} className={`min-h-[44px] justify-center rounded-pill border px-3 ${filtro === item ? 'border-brand bg-brand-soft' : 'border-line bg-surface-raised'}`}><Text className="text-caption-strong text-ink">{item}</Text></Pressable>)}</ScrollView>
        {resultados.map(livro => <View key={livro.id} className="gap-2 rounded-lg border border-line bg-surface-raised p-3"><View className="flex-row gap-3"><CapaLivro nome={livro.titulo} autor={livro.autor} cor={livro.id === 1 ? 'cover1' : livro.id === 2 ? 'cover4' : 'cover6'} largura={82} /><View className="min-w-0 flex-1 gap-2"><Text className="text-book-title text-ink">{livro.titulo}</Text><Text className="text-caption text-ink-muted">{livro.autor}</Text><Text className="text-caption text-ink-muted">{livro.exemplares} exemplares · {livro.fila ? `${livro.fila} na fila` : 'Estante 005.1'}{livro.pausado ? ' · Indisponível para novos pedidos' : ''}</Text><Text className={`text-overline ${livro.emprestado ? 'text-warning' : 'text-success'}`}>{livro.emprestado ? 'Emprestado' : 'Disponível'}</Text></View></View><Button size="sm" variant="ghost" icon="pencil" onPress={() => editar(livro)}>Editar</Button></View>)}
        {!resultados.length ? <Text className="text-body text-ink-muted">Nenhum livro encontrado.</Text> : null}
      </> : externo ? <>
        <Caixa tom="sucesso"><Text className="text-label text-success">Fontes externas responderam</Text><Text className="text-body text-ink">Livro encontrado pelo ISBN 978-85-7608-267-5. Dados demonstrativos.</Text></Caixa>
        <View className="flex-row gap-3"><CapaLivro nome={alvo.titulo} autor={alvo.autor} cor="cover1" largura={82} /><View className="flex-1 gap-2"><Text className="text-book-title text-ink">{alvo.titulo}</Text><Text className="text-body text-ink-muted">Robert C. Martin · Alta Books · 2011</Text></View></View>
        <Text className="text-title-sm text-ink">O que será atualizado</Text><Caixa><Text className="text-label text-ink">Capa e sinopse</Text><Text className="text-body text-ink-muted">Novas, vindas das fontes externas.</Text><Text className="text-label text-ink">Autores, editora e ano</Text><Text className="text-body text-ink-muted">Conferidos com o cadastro atual.</Text></Caixa>
        <Caixa tom="brand"><Text className="text-label text-ink">Não muda</Text><Text className="text-body text-ink-muted">CDU, Cutter, estante e número de exemplares não vêm das fontes externas e não mudam.</Text></Caixa>
      </> : <>
        {modo !== 'novo' ? <View className="flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4"><View className="flex-1 gap-1"><Text className="text-label text-ink">Indisponível para novos pedidos</Text><Text className="text-caption text-ink-muted">O livro continua no catálogo, mas ninguém solicita nem entra na fila.</Text></View><Switch accessibilityLabel="Indisponível para novos pedidos" value={pausado} onValueChange={setPausado} trackColor={{ true: colors.brand }} /></View> : null}
        {pausado ? <Caixa tom="aviso"><Text className="text-label text-warning">Livro pausado</Text><Text className="text-body text-ink">Os alunos ainda veem o livro no catálogo, com os botões Solicitar empréstimo e Entrar na fila desativados. Pedidos e filas que já existem não mudam.</Text></Caixa> : null}
        <View className="flex-row items-center gap-2"><View className="flex-1"><TextField label="ISBN" icon="barcode" value={isbn} onChangeText={setIsbn} error={erroIsbn ? 'Não encontrado nas fontes externas. Preencha os dados abaixo à mão.' : undefined} /></View><Button size="sm" variant="tonal" icon="globe" onPress={() => { if (isbn.replace(/\D/g, '') === '9788576082675' && selecionado) setModo('atualizar'); else setErroIsbn(true) }}>Buscar</Button></View>
        <TextField label="Título" value={titulo} onChangeText={setTitulo} placeholder="Preenchido pelas fontes externas" error={tentou && !titulo.trim() ? 'Informe o título.' : undefined} />
        <TextField label="Autores" value={autor} onChangeText={setAutor} placeholder="Preenchido pelas fontes externas" error={tentou && !autor.trim() ? 'Informe os autores.' : undefined} />
        <TextField label="Editora" value={editora} onChangeText={setEditora} placeholder="Preenchido pelas fontes externas" error={tentou && !editora.trim() ? 'Informe a editora.' : undefined} />
        <View className="flex-row gap-3"><View className="flex-1"><TextField label="Edição" value={edicao} onChangeText={setEdicao} placeholder="Ex.: 2ª" /></View><View className="flex-1"><TextField label="Ano" value={ano} onChangeText={v => setAno(v.replace(/\D/g, ''))} inputMode="numeric" maxLength={4} placeholder="Ex.: 2019" error={tentou && !/^\d{4}$/.test(ano) ? 'Informe 4 dígitos.' : undefined} /></View></View>
        <Text className="text-title-sm text-ink">Dados da biblioteca</Text>
        <View className="flex-row gap-3"><View className="flex-1"><TextField label="CDU" value={cdu} onChangeText={setCdu} error={tentou && !cdu.trim() ? 'Informe a CDU.' : undefined} /></View><View className="flex-1"><TextField label="Cutter" value={cutter} onChangeText={setCutter} error={tentou && !cutter.trim() ? 'Informe o Cutter.' : undefined} /></View></View>
        <TextField label="Estante" value={estante} onChangeText={setEstante} error={tentou && !estante.trim() ? 'Informe a estante.' : undefined} />
        <TextField label="Exemplares" value={exemplares} onChangeText={v => setExemplares(v.replace(/\D/g, ''))} inputMode="numeric" error={tentou && (!/^\d+$/.test(exemplares) || Number(exemplares) < 1) ? 'Informe pelo menos 1 exemplar.' : undefined} />
      </>}
    </ScrollView>
    {!lista ? <View className="gap-2 border-t border-line bg-surface-raised px-4 pt-3" style={{ paddingBottom: Math.max(safe.bottom, 16) }}><Button block onPress={externo ? () => { setMensagem('Atualização demonstrativa aplicada. Dados da biblioteca preservados.'); setModo('editar') } : salvar}>{externo ? 'Aplicar ao acervo' : modo === 'novo' ? 'Cadastrar livro' : 'Salvar alterações'}</Button>{externo ? <Button block variant="ghost" onPress={() => setModo('editar')}>Cancelar</Button> : null}</View> : <BottomNav role="bibliotecario" active={0} onSelect={onSelecionarAba} />}
    <ConfirmationSheet visible={modo === 'remover'} danger title={`Remover ${alvo.titulo} do acervo?`} description="O livro some da busca dos alunos. O histórico de empréstimos é mantido. Só dá para remover livros sem exemplar emprestado e sem fila. Operação demonstrativa." confirmText="Remover livro" onCancel={() => setModo('lista')} onConfirm={() => { if (alvo.emprestado || alvo.fila) return; setLivros(lista => lista.filter(l => l.id !== alvo.id)); setMensagem('Livro removido da demonstração.'); setModo('lista') }} />
  </View>
}
