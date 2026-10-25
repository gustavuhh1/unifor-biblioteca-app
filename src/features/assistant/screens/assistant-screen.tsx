import { useRef, useState, type ComponentRef } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Icon, BookCover, coverToneOf } from '@/shared/components'
import { Caixa, Linha } from '@/shared/components/blocos'
import { useTheme } from '@/shared/theme/theme-provider'
import { useReducedMotion } from '@/shared/theme/use-reduced-motion'

type EstadoAssistente =
  'busca' | 'conversa' | 'erro' | 'confirmar' | 'bloqueado'
type Mensagem = { texto: string; usuario?: boolean }
type AssistenteProps = {
  estado?: EstadoAssistente
  onVerParecidos?: () => void
  onBuscarOutroTermo?: () => void
  onAbrirLivro?: () => void
  onConfirmarSolicitacao?: () => void
}
function Bolha({ texto, usuario }: Mensagem) {
  return (
    <View className={`gap-2 ${usuario ? 'items-end' : ''}`}>
      {!usuario ? (
        <View className="flex-row items-center gap-2">
          <Icon name="sparkle" color="brand" size={16} />
          <Text className="text-caption-strong text-brand">Assistente</Text>
        </View>
      ) : null}
      <View
        className={`rounded-lg p-4 ${usuario ? 'max-w-[280px] rounded-br-sm bg-brand' : 'border border-line bg-surface-raised'}`}
      >
        <Text className={`text-body ${usuario ? 'text-on-brand' : 'text-ink'}`}>
          {texto}
        </Text>
      </View>
      <Text className="text-micro text-ink-muted">19:44</Text>
    </View>
  )
}
export function AssistantScreen({
  estado = 'busca',
  onVerParecidos,
  onBuscarOutroTermo,
  onAbrirLivro,
  onConfirmarSolicitacao,
}: AssistenteProps) {
  const safe = useSafeAreaInsets()
  const { colors } = useTheme()
  const reducedMotion = useReducedMotion()
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  const [texto, setTexto] = useState('')
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [erro, setErro] = useState(estado === 'erro')
  const [confirmar, setConfirmar] = useState(estado === 'confirmar')
  const [cancelado, setCancelado] = useState(false)
  const bloqueado = estado === 'bloqueado'
  const pedir = estado === 'confirmar' || bloqueado
  const busca = estado === 'busca'
  function enviar() {
    if (!texto.trim()) return
    const pedido = /pegar|solicitar|emprestar/i.test(texto)
    setMensagens((current) => [
      ...current,
      { texto: texto.trim(), usuario: true },
      {
        texto: bloqueado
          ? 'Não consigo solicitar agora: você está com Cálculo, Vol. 1 em atraso. Devolva no balcão para voltar a pedir livros e entrar em filas.'
          : pedido
            ? 'Posso solicitar este empréstimo para você. Confira antes de eu fazer. Só solicito depois da sua confirmação.'
            : 'Resposta demonstrativa: consulte o Acervo para buscar livros. Os prazos e pedidos aparecem em Meus empréstimos. Nenhuma solicitação foi enviada.',
      },
    ])
    if (pedido && !bloqueado) {
      setConfirmar(true)
      setCancelado(false)
    }
    setTexto('')
  }
  return (
    <View className="flex-1 bg-surface">
      <View
        className="flex-row items-center gap-3 border-b border-line px-4 pb-3"
        style={{ paddingTop: safe.top + 12 }}
      >
        <View className="flex-1 gap-1">
          <Text className="text-title-lg text-ink">Assistente</Text>
          <Text className="text-caption text-ink-muted">
            Dúvidas sobre o app e sugestões de leitura
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova conversa"
          onPress={() => {
            setMensagens([])
            setTexto('')
            setConfirmar(false)
            setErro(false)
            setCancelado(false)
          }}
          className="min-h-[44px] min-w-[44px] items-center justify-center"
        >
          <Icon name="refresh" color="inkMuted" />
        </Pressable>
      </View>
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: !reducedMotion })
        }
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        {!busca && !pedir ? (
          <>
            <Bolha usuario texto="Como funciona a fila?" />
            <Bolha texto="Se o livro estiver emprestado, você entra na fila e vê quantas pessoas estão na frente. Quando chegar sua vez, tem 24h para confirmar e 2 dias úteis para retirar." />
          </>
        ) : null}
        <Bolha
          usuario
          texto={
            busca
              ? 'Procure livros sobre programação quântica. Se não tiver, sugira parecidos.'
              : pedir
                ? 'Quero pegar o Refatoração'
                : 'Me indica algo parecido com Código Limpo'
          }
        />
        <Bolha
          texto={
            erro
              ? 'Não consegui responder agora. Confira sua conexão e tente de novo.'
              : bloqueado
                ? 'Não consigo solicitar agora: você está com Cálculo, Vol. 1 em atraso desde 10/10 (multa de R$ 6,00). Devolva no balcão da biblioteca para voltar a pedir livros e entrar em filas.'
                : pedir
                  ? 'Posso solicitar este empréstimo para você. Confira antes de eu fazer. Só solicito depois da sua confirmação.'
                  : busca
                    ? 'Não achei esse tema no acervo. Estes estão na estante e são a base dele:'
                    : 'Você tem lido bastante sobre boas práticas. Este está disponível agora:'
          }
        />
        {erro ? (
          <Button
            variant="secondary"
            icon="refresh"
            onPress={() => setErro(false)}
          >
            Tentar de novo
          </Button>
        ) : !pedir ? (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={onAbrirLivro}
              className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-3"
            >
              <BookCover
                title={busca ? 'Física Quântica' : 'Refatoração'}
                author={busca ? 'Eisberg, Resnick' : 'Martin Fowler'}
                tone={coverToneOf(busca ? 'cover1' : 'cover2')}
                size="md"
              />
              <View className="min-w-0 flex-1 gap-2">
                <Text className="text-book-title text-ink">
                  {busca ? 'Física Quântica' : 'Refatoração'}
                </Text>
                <Text className="text-caption text-ink-muted">
                  {busca ? 'Eisberg, Resnick' : 'Martin Fowler'}
                </Text>
                <Text className="text-caption text-ink-muted">
                  {busca ? 'Base de física quântica' : 'Pelo que você leu'}
                </Text>
                <Text className="text-overline text-success">Disponível</Text>
              </View>
            </Pressable>
            {busca ? (
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Button
                    block
                    size="sm"
                    variant="secondary"
                    onPress={onVerParecidos}
                  >
                    Ver mais parecidos
                  </Button>
                </View>
                <View className="flex-1">
                  <Button
                    block
                    size="sm"
                    variant="secondary"
                    onPress={onBuscarOutroTermo}
                  >
                    Buscar outro termo
                  </Button>
                </View>
              </View>
            ) : null}
          </>
        ) : null}
        {mensagens.map((mensagem, index) => (
          <Bolha key={index} {...mensagem} />
        ))}
        {confirmar && !bloqueado ? (
          <View className="gap-4 rounded-lg border border-brand bg-surface-raised p-4">
            <Text className="text-book-title text-ink">Refatoração</Text>
            <Text className="text-caption text-ink-muted">Martin Fowler</Text>
            <Caixa>
              <Linha
                esquerda="Retirar até"
                direita="seg, 19/10 (2 dias úteis)"
              />
              <Linha esquerda="Seus empréstimos" direita="passa a 4 de 10" />
            </Caixa>
            <Button
              block
              icon="check"
              onPress={() => {
                setConfirmar(false)
                onConfirmarSolicitacao?.()
              }}
            >
              Confirmar solicitação
            </Button>
            <Button
              block
              variant="ghost"
              onPress={() => {
                setConfirmar(false)
                setCancelado(true)
              }}
            >
              Cancelar
            </Button>
          </View>
        ) : null}
        {cancelado ? (
          <Text
            accessibilityLiveRegion="polite"
            className="text-caption text-ink-muted"
          >
            Solicitação cancelada. Nenhum pedido foi enviado.
          </Text>
        ) : null}
        <View className="flex-row gap-2">
          <Icon name="info" color="inkMuted" size={14} />
          <Text className="flex-1 text-caption text-ink-muted">
            Conversa demonstrativa, sem conexão com IA. O Assistente usa IA e
            pode errar. Confira prazos e regras na página do livro e em Meus
            empréstimos.
          </Text>
        </View>
      </ScrollView>
      <View className="flex-row items-center gap-2 border-t border-line bg-surface-raised px-4 py-3">
        <TextInput
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={enviar}
          returnKeyType="send"
          placeholder="Pergunte sobre livros ou empréstimos"
          placeholderTextColor={colors.inkMuted}
          className="min-h-12 min-w-0 flex-1 rounded-pill border border-line bg-surface-sunken px-4 text-body text-ink"
          accessibilityLabel="Mensagem ao Assistente"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enviar mensagem"
          accessibilityState={{ disabled: !texto.trim() }}
          disabled={!texto.trim()}
          onPress={enviar}
          className="h-[44px] w-[44px] items-center justify-center rounded-pill bg-brand"
        >
          <Icon name="send" color="onBrand" />
        </Pressable>
      </View>
    </View>
  )
}
