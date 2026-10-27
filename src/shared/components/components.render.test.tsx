import { render, screen } from '@testing-library/react-native'
import type { ReactElement } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  Alert,
  Avatar,
  BookCard,
  BookCover,
  BottomSheet,
  ChatBubble,
  ChatComposer,
  Chip,
  DeadlineChip,
  EmptyState,
  FineCard,
  LoanCard,
  LoanTimeline,
  NotificationItem,
  PromptSugerido,
  QRPass,
  titleWords,
  QueueInfo,
  QueueManagerRow,
  SearchBar,
  SegmentedTabs,
  StatTile,
  StatusBadge,
  Toast,
  Toggle,
} from '.'

// O ThemeProvider de verdade troca o tema do NativeWind, o que não existe no Jest:
// aqui o tema é sempre o claro.
jest.mock('../theme/theme-provider', () => {
  const { themeColors, themeShadows } = jest.requireActual(
    '../theme/tokens.generated',
  )
  return {
    useTheme: () => ({
      scheme: 'light',
      colors: themeColors.light,
      shadows: themeShadows.light,
    }),
  }
})

const frame = { x: 0, y: 0, width: 390, height: 844 }
const insets = { top: 0, left: 0, right: 0, bottom: 0 }

// Monta o componente dentro da área segura, como o app faz.
function renderInApp(element: ReactElement) {
  return render(
    <SafeAreaProvider initialMetrics={{ frame, insets }}>
      {element}
    </SafeAreaProvider>,
  )
}

// Garante que cada componente do design system monta sem erro e mostra o texto
// principal que o Figma pede (não confere o visual, só que a tela não quebra).
describe('componentes do design system: montam e mostram o texto', () => {
  it('StatusBadge mostra a palavra do estado e aceita outra', async () => {
    await renderInApp(<StatusBadge status="atrasado" />)
    expect(screen.getByText('Atrasado')).toBeTruthy()
    await renderInApp(
      <StatusBadge status="emprestado" label="Emprestado até 24/10" />,
    )
    expect(screen.getByText('Emprestado até 24/10')).toBeTruthy()
  })

  it('BookCover mostra título e autor nos tamanhos M e G, e nada no P', async () => {
    await renderInApp(
      <BookCover title="Código Limpo" author="Robert C. Martin" size="md" />,
    )
    // O título é desenhado palavra por palavra (a palavra nunca quebra no meio).
    expect(screen.getByText('Código')).toBeTruthy()
    expect(screen.getByText('Limpo')).toBeTruthy()
    expect(screen.getByText('Robert C. Martin')).toBeTruthy()
    await renderInApp(<BookCover title="Sem texto" size="sm" />)
    expect(screen.queryByText('Sem')).toBeNull()
    expect(screen.queryByText('texto')).toBeNull()
  })

  it('titleWords separa o título em palavras e ignora espaços sobrando', () => {
    expect(titleWords('  Padrões  de Projeto ')).toEqual([
      'Padrões',
      'de',
      'Projeto',
    ])
    expect(titleWords('')).toEqual([])
  })

  it('Avatar mostra as iniciais', async () => {
    await renderInApp(<Avatar name="Lucas Almeida" />)
    // O avatar é decorativo (o nome vem escrito ao lado), então fica oculto aos leitores de tela.
    expect(screen.getByText('LA', { includeHiddenElements: true })).toBeTruthy()
  })

  it('Chip junta o rótulo e o contador', async () => {
    await renderInApp(<Chip count={12}>Todos</Chip>)
    expect(screen.getByText('Todos 12')).toBeTruthy()
  })

  it('DeadlineChip mostra o prazo', async () => {
    await renderInApp(
      <DeadlineChip kind="retirar">Retire até seg, 19/10</DeadlineChip>,
    )
    expect(screen.getByText('Retire até seg, 19/10')).toBeTruthy()
  })

  it('SearchBar mostra o texto de ajuda e só mostra Filtros se pedido', async () => {
    await renderInApp(<SearchBar />)
    expect(
      screen.getByPlaceholderText('Buscar título, autor ou assunto'),
    ).toBeTruthy()
    expect(screen.queryByLabelText('Filtros')).toBeNull()
    await renderInApp(<SearchBar showFilter />)
    expect(screen.getByLabelText('Filtros')).toBeTruthy()
  })

  it('SegmentedTabs mostra as abas e marca a ativa', async () => {
    await renderInApp(
      <SegmentedTabs
        items={[{ label: 'Ativos' }, { label: 'Na fila', count: 2 }]}
        value={1}
      />,
    )
    expect(screen.getByText('Ativos')).toBeTruthy()
    expect(screen.getByText('Na fila (2)')).toBeTruthy()
  })

  it('BookCard mostra título, autor com ano e o status', async () => {
    await renderInApp(
      <BookCard
        title="Código Limpo"
        author="Robert C. Martin"
        year={2011}
        status="disponivel"
      />,
    )
    expect(screen.getAllByText('Código Limpo').length).toBeGreaterThan(0)
    expect(screen.getByText('Robert C. Martin · 2011')).toBeTruthy()
    expect(screen.getByText('Disponível')).toBeTruthy()
  })

  it('Alert mostra título e texto', async () => {
    await renderInApp(
      <Alert tone="warning" title="Renovação indisponível">
        Há 2 alunos na fila deste livro.
      </Alert>,
    )
    expect(screen.getByText('Renovação indisponível')).toBeTruthy()
    expect(screen.getByText('Há 2 alunos na fila deste livro.')).toBeTruthy()
  })

  it('QueueInfo diz quantas pessoas estão na frente', async () => {
    await renderInApp(
      <QueueInfo ahead={3} note="Se entrar agora, você será o 4º da fila." />,
    )
    expect(screen.getByText('pessoas na sua frente')).toBeTruthy()
    expect(screen.getByText('4º')).toBeTruthy()
    await renderInApp(<QueueInfo ahead={1} joined />)
    expect(screen.getByText('pessoa na sua frente')).toBeTruthy()
    expect(screen.getByText('Você')).toBeTruthy()
  })

  it('Toggle expõe o estado ligado para leitores de tela', async () => {
    await renderInApp(<Toggle checked label="Multa paga agora" />)
    expect(screen.getByRole('switch', { checked: true })).toBeTruthy()
  })

  it('LoanCard mostra datas, motivo da renovação bloqueada e ações', async () => {
    await renderInApp(
      <LoanCard
        title="Arquitetura Limpa"
        author="Robert C. Martin"
        status="vence"
        progress={0.9}
        startLabel="Retirado 10/10"
        dueLabel="Devolver até 24/10"
        renewBlocked
        renewReason="Renovação indisponível: 2 alunos na fila deste livro."
      />,
    )
    expect(screen.getByText('Devolver até 24/10')).toBeTruthy()
    expect(
      screen.getByText('Renovação indisponível: 2 alunos na fila deste livro.'),
    ).toBeTruthy()
  })

  it('LoanTimeline mostra todas as etapas', async () => {
    await renderInApp(
      <LoanTimeline
        steps={[
          {
            label: 'Livro liberado para você',
            detail: '14/10 às 09:12',
            state: 'done',
          },
          { label: 'Confirmar a vez', state: 'current' },
          { label: 'Retirar no balcão', state: 'todo' },
        ]}
      />,
    )
    expect(screen.getByText('Livro liberado para você')).toBeTruthy()
    expect(screen.getByText('Retirar no balcão')).toBeTruthy()
  })

  it('FineCard mostra o cálculo da multa e o aviso de pagamento só no balcão', async () => {
    await renderInApp(
      <FineCard amount="R$ 6,00" daysLate={3} book="Cálculo, Vol. 1" />,
    )
    expect(screen.getByText('R$ 6,00')).toBeTruthy()
    expect(screen.getByText('3 dias úteis × R$ 2,00')).toBeTruthy()
    expect(screen.getByText(/Pagamento só presencial/)).toBeTruthy()
    await renderInApp(
      <FineCard amount="R$ 2,00" daysLate={1} showPayment={false} />,
    )
    expect(screen.getByText('1 dia útil × R$ 2,00')).toBeTruthy()
  })

  it('QRPass mostra o código do pedido, o aluno e o livro', async () => {
    await renderInApp(
      <QRPass
        value="segredo-do-qr"
        code="RET-4821"
        matricula="2412858"
        name="Lucas Almeida"
        book="Código Limpo"
        expires="até seg, 19/10"
      />,
    )
    expect(screen.getByText('RET-4821')).toBeTruthy()
    expect(screen.getByText('Lucas Almeida · Matrícula 2412858')).toBeTruthy()
    expect(screen.getByLabelText('QR do pedido RET-4821')).toBeTruthy()
  })

  it('StatTile mostra o número e o rótulo', async () => {
    await renderInApp(<StatTile value={12} label="Livros para separar" />)
    expect(screen.getByText('12')).toBeTruthy()
    expect(screen.getByText('Livros para separar')).toBeTruthy()
  })

  it('QueueManagerRow mostra a posição, o aluno e a matrícula', async () => {
    await renderInApp(
      <QueueManagerRow
        position={1}
        name="Ana Beatriz Lima"
        matricula="2311047"
        since="desde 02/10"
      />,
    )
    expect(screen.getByText('1º')).toBeTruthy()
    expect(screen.getByText('2311047 · desde 02/10')).toBeTruthy()
  })

  it('NotificationItem mostra título, texto e hora', async () => {
    await renderInApp(
      <NotificationItem
        title="É a sua vez: Código Limpo"
        text="Confirme até amanhã, 09:12, que vai retirar."
        time="09:12"
        unread
      />,
    )
    expect(screen.getByText('É a sua vez: Código Limpo')).toBeTruthy()
    expect(screen.getByText('09:12')).toBeTruthy()
  })

  it('EmptyState mostra título e texto', async () => {
    await renderInApp(
      <EmptyState title="Nenhum empréstimo ativo" text="Busque no acervo." />,
    )
    expect(screen.getByText('Nenhum empréstimo ativo')).toBeTruthy()
  })

  it('PromptSugerido mostra a pergunta pronta', async () => {
    await renderInApp(
      <PromptSugerido text="Procure livros sobre programação quântica." />,
    )
    expect(
      screen.getByText('Procure livros sobre programação quântica.'),
    ).toBeTruthy()
  })

  it('BottomSheet mostra o conteúdo só quando está aberto', async () => {
    await renderInApp(
      <BottomSheet
        visible
        onClose={() => undefined}
        title="Entrar na fila de Código Limpo?"
        text="O livro está emprestado."
      />,
    )
    expect(screen.getByText('Entrar na fila de Código Limpo?')).toBeTruthy()
    await renderInApp(
      <BottomSheet
        visible={false}
        onClose={() => undefined}
        title="Escondido"
      />,
    )
    expect(screen.queryByText('Escondido')).toBeNull()
  })

  it('Toast mostra a mensagem e a ação', async () => {
    await renderInApp(<Toast message="Renovado até 06/11." action="Desfazer" />)
    expect(screen.getByText('Renovado até 06/11.')).toBeTruthy()
    expect(screen.getByText('Desfazer')).toBeTruthy()
  })

  it('ChatBubble e ChatComposer montam', async () => {
    await renderInApp(<ChatBubble time="19:41">Oi, Lucas!</ChatBubble>)
    expect(screen.getByText('Oi, Lucas!')).toBeTruthy()
    expect(screen.getByText('Assistente')).toBeTruthy()
    await renderInApp(<ChatComposer />)
    expect(screen.getByLabelText('Enviar')).toBeTruthy()
  })
})
