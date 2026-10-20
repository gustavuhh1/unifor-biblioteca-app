App mobile da biblioteca da Unifor para dois perfis: o **aluno** busca no acervo, solicita empréstimos, entra em filas e conversa com o Assistente (IA); o **bibliotecário** atende o balcão (retirada e devolução) e intervém nas filas quando preciso. Tudo o que não exige mãos humanas (andar da fila, prazos, avisos, multas) é automático.

## Regras de negócio que a interface precisa mostrar

- **Matrícula** de 7 dígitos (ex.: `2412858`; os dois primeiros são o ano de ingresso). O perfil (aluno ou bibliotecário) vem do login, num único app.
- **Cadastro:** só com e-mail institucional (final `@edu.unifor.br`), matrícula, senha e confirmação da senha. O e-mail recebe um token de 6 dígitos, digitado no app (`CodeInput`). Depois do token o celular cria o **passkey** (com a opção "Agora não"). O fluxo mostra as etapas com `Stepper`.
- **Login do dia a dia:** o app é o mesmo nas duas entregas e a sessão é do Firebase Authentication. O botão principal é o **passkey** (biometria ou PIN, só no Android) e a matrícula e senha ficam em "Outras formas de entrar", junto com "Esqueci minha senha". A senha serve para entrar e para a **recuperação**: token no e-mail (vale 20 minutos, uso único), nova senha e um passkey novo no aparelho novo.
- **Erros de acesso:** "Matrícula ou senha incorretos." no campo; sessão expirada volta ao login com o aviso "Sua sessão expirou"; token vencido ou já usado oferece "Reenviar token"; matrícula ou e-mail que já têm conta mostram o erro no campo repetido.
- **Aluno de graduação:** até **10 livros** ao mesmo tempo, **14 dias** por empréstimo. Não pode emprestar dois exemplares do mesmo título, nem edições diferentes.
- **Livro disponível e sem fila:** o aluno solicita e tem **2 dias úteis** para retirar no balcão.
- **Livro emprestado:** o aluno vê quantas pessoas estão na frente **antes** de entrar na fila (`QueueInfo`). A fila respeita a ordem de entrada.
- **Quando o livro volta:** o 1º da fila é avisado e tem **24h para confirmar** que vai retirar; ao confirmar, ganha **2 dias úteis** para retirar. Fim de semana, feriado e recesso não contam. Se não confirmar ou não retirar, **sai da fila** e o próximo é avisado.
- **Renovação:** **uma única** por empréstimo, de +14 dias, dentro do prazo. Não renova se o empréstimo está em atraso, se há pessoas na fila do livro ou se a renovação já foi usada. Quando bloqueada, diga o motivo (`LoanCard` `renewBlocked`).
- **Atraso e multa:** R$ 2,00 por dia útil de atraso, por livro, até a devolução; a multa é paga só no balcão. Atraso bloqueia novos empréstimos (solicitar, entrar em fila, retirar). Multa em aberto sem atraso só mostra um aviso.
- **Retirada no balcão:** o aluno mostra o `QRPass` (funciona sem internet). O bibliotecário usa um **leitor único, sem abas**: o QR do pedido abre a **ficha do aluno** (pedido pronto e livros com ele), de onde ele entrega o pedido ou registra devoluções. Sem QR, ele digita a matrícula ou o código do pedido e cai na mesma ficha.
- **Gestão da fila:** automática. O bibliotecário mexe só em exceções: muda a posição de um aluno, reenvia o aviso, remove com motivo e adiciona um aluno em qualquer posição. Pôr alguém no fim não pede confirmação; passar à frente de outros pede confirmação listando quem desce, com motivo, e o aluno afetado é avisado.
- **Assistente (IA):** só para o aluno. Ensina a usar o app e sugere livros com base no que o aluno mais leu; as mesmas sugestões aparecem no Início, em "Recomendados para você". Também solicita empréstimo e entra em fila, mas sempre mostra antes o que vai fazer e espera a confirmação do aluno. Se uma regra bloqueia a ação (atraso, limite), ele explica o motivo e não oferece confirmação.
- **Salvos:** o aluno guarda livros em pastas (criar, renomear, excluir, organizar). Fica no Perfil e é acessado pelo ícone de marcador da página do livro.
- **Busca no acervo (aluno):** só a barra de busca (título, autor ou assunto, ignorando acento), **sem filtros**: use `SearchBar` com `showFilter={false}` e sem chips.
- **Acervo (bibliotecário):** cria, edita e remove livros e atualiza um livro pelo Google Books (ISBN). Se o Google Books não encontra o ISBN, o campo mostra o erro em vermelho e o bibliotecário preenche à mão. Só remove um livro sem exemplar emprestado e sem fila; senão, marca o livro como **"Indisponível para novos pedidos"**: ele continua no catálogo, com Solicitar e Entrar na fila desativados.
- **Multas (bibliotecário):** busca por nome ou matrícula e abas Em aberto, Contando e Pagas, sem ícone de filtros. **Retiradas:** uma lista única de pedidos confirmados, do prazo mais curto ao mais longo, com busca pela matrícula do aluno; sem abas e sem selo de status (decidido em 18/10).

## Voz e texto

- Português do Brasil, tratando o aluno por **você**. Frases curtas, sem jargão de biblioteconomia ("acervo" sim, "circulação" não).
- Letra maiúscula só no início da frase e em nomes próprios: "Meus empréstimos", não "Meus Empréstimos". Badges de status usam o estilo `overline` (caixa alta automática).
- Botões começam com verbo: "Solicitar empréstimo", "Entrar na fila", "Confirmar retirada", "Mostrar QR".
- Prazos sempre por extenso e concretos: "Retire até seg, 19/10", "Confirme em 18h 40min", "Devolver até 24/10". Nunca "em breve".
- Diga o que acontece depois: "Quando chegar sua vez, você terá 24h para confirmar."
- Sem emoji. O único ícone "simpático" é `sparkle`, reservado ao Assistente.
- Títulos de livros sempre na serifa (`book-title`, `book-title-lg`), o resto da interface na sans (`body`, `label`, `caption`).

## Cor

- Fundo de tela `surface`; cards, barras e campos em `surface-raised`; trilhos e áreas recuadas em `surface-sunken`. Divisórias em `line`; contornos de campos em `line-strong`.
- `brand` é o azul do símbolo Unifor (#004AF5). Use para a ação principal, o item ativo da navegação e links. Um botão primário por tela.
- Texto principal em `ink`, secundário em `ink-muted`. `ink-faint` só para placeholder e desativado.
- Status têm cor fixa e sempre vêm com ícone e palavra:
  - `success` / `success-soft`: Disponível, Devolvido.
  - `warning` / `warning-soft`: Emprestado, Confirme (24h), Vence em breve.
  - `brand-soft` com `brand-strong`: Na fila, Reservado, Pronto p/ retirar, Em andamento.
  - `danger` / `danger-soft`: Atrasado, multa, ações destrutivas.
  - `neutral-soft` com `neutral-ink`: Expirado, Cancelado.
- Capas geradas usam `cover-1`…`cover-6` com texto em `on-cover`. Não use essas cores fora das capas.
- Texto sobre `danger` cheio (contador de avisos) usa `on-danger`.
- O QR de retirada usa `qr-ink` sobre `qr-paper` e fica escuro sobre branco também no tema escuro, para o leitor do balcão.
- No tema escuro o azul clareia (`brand` vira #7FA6FF), então texto sobre ele usa `on-brand` (escuro). O mesmo vale para `danger` e `on-danger`. Nunca escreva branco literal sobre `brand` ou `danger`.
- Todos os pares de texto passam de 4,5:1 nos dois temas; `line-strong` e `focus` passam de 3:1.

## Tema escuro

- Os dois temas usam os mesmos nomes de token; só os valores mudam. Na web, `data-theme="dark"` na raiz da tela troca tudo; no app, o tema vem da tela Aparência (Claro, Escuro ou igual ao celular).
- No escuro: fundo `surface` #0B0F1A, cards em `surface-raised` #141A29, texto `ink` #EEF1F8. Os status ficam em fundos escuros (`*-soft`) com a cor clara por cima, e todos os pares de texto continuam acima de 4,5:1 (conferido em 18/10).
- Sombras quase somem no escuro; a separação entre cards vem de `line` e da diferença entre `surface` e `surface-raised`.
- Ficam iguais nos dois temas: capas geradas (`cover-*` com `on-cover`), o QR (`qr-ink` sobre `qr-paper`) e a câmera do leitor de QR, que é sempre escura.
- O `Toast` inverte as cores (fundo `ink`, texto `surface`), então fica claro no tema escuro.
- O símbolo da Unifor fica no quadrado azul nos dois temas.

## Tipografia

- **Figtree** (`--font-sans`) para toda a interface; **Newsreader** (`--font-serif`) só para títulos de obras. Ambas do Google Fonts.
- Escala base: `display` 30 (saudação e números do painel), `title-lg` 24 (título de tela raiz), `title` 19 (seções e sheets), `body-lg` 17, `body` 15 (texto corrido e chat), `label` 15/600 (botões e itens), `caption` 13 (metadados), `overline` 11 em caixa alta (rótulos de seção e badges).
- Estilos de apoio (os mesmos 29 do Figma): `hero` 28, `number` 30/800 e `number-lg` 36/800 (multa, fila, painel), `stat` 20/800 (cards de resumo), `title-sm` 17/700, `label-lg` 17, `label-sm` 14, `body-sm` 14, `caption-strong` 13/600, `caption-sm` 12, `micro` e `micro-strong` 11, `code` 24 com espaçamento largo (RET-4821 e token), `book-title-sm` 15 e os estilos das capas (`capa-g`, `capa-m`, `capa-p` na serifa, `capa-autor` em caixa alta). `secao` 56 é só para a documentação no Figma.
- Números grandes de fila, multa e painel em 800 com espaçamento -0.02em.

## Espaço, forma e profundidade

- Margem lateral da tela `space-4` (16px); entre seções `space-6`; entre cards de uma lista `space-3`.
- Meios-passos para ajuste fino: `space-0-5` (2), `space-1-5` (6), `space-2-5` (10), `space-3-5` (14). Passos grandes para topo de tela: `space-12` (48), `space-14` (56), `space-18` (72). Desde 18/10 todo padding e gap das telas no Figma usa um destes tokens; os valores soltos foram arredondados (3→4, 5→4, 18→16, 28→24, 68→72).
- Raios: `radius-sm` badges e capas pequenas, `radius-md` botões, campos e capas, `radius-lg` cards e bolhas, `radius-sheet` bottom sheets e o cartão de QR, `radius-pill` chips, prazos e abas.
- Sombras discretas: `shadow-card` nos cards; `shadow-sheet` em sheets e navegação; `shadow-float` só no botão Escanear do bibliotecário.
- Alvos de toque com no mínimo 44px; botões com 48px.
- Foco: anel sólido de 2px em `focus`, afastado 2px.

## Marca

- O símbolo Unifor (`assets/Logos/unifor-simbolo.png`) aparece nas telas de acesso (abertura, login e cadastro), em `brand` sobre `surface` ou branco sobre `brand`. Não redesenhe, não distorça, não aplique sobre capas.
- A assinatura do app é "Unifor Biblioteca", em `title-lg` ao lado ou abaixo do símbolo.
- Os arcos concêntricos da marca aparecem como motivo gráfico no canto das capas geradas (`BookCover`) e na capa deste sistema. Não use como decoração solta nas telas.

## Ícones

- Conjunto próprio em traço de 2px, grade de 24, desenho no estilo Lucide (`Icon`, `UniforBib.iconNames`). Herdam a cor do texto. No Figma os nomes usam hífen (`map-pin`); no código, camelCase (`mapPin`).
- 20px em listas e campos, 22px na AppBar e navegação, 28px no botão Escanear.
- Significados fixos: `users` = fila, `hand` = reservado para você, `qr`/`scan` = retirada, `sparkle` = Assistente, `refresh` = renovar, `coin` = multa, `fingerprint` = passkey, `bookmark` = Salvos.

## Navegação

- **Aluno:** `BottomNav role="aluno"` com Início · Acervo · Empréstimos · Assistente · Perfil.
- **Bibliotecário:** `BottomNav role="bibliotecario"` com Painel · Retiradas · **Escanear** (botão central elevado) · Filas · Multas. Escanear abre a câmera em um toque, de qualquer tela. O Acervo (gestão) abre por um atalho no Painel.
- Telas raiz usam `AppBar large`; telas internas usam `AppBar back`.
- **Perfil do aluno** lista: Salvos, Histórico, Meus passkeys, Avisos e lembretes, Aparência, Regras da biblioteca e Sair. O bibliotecário abre o perfil pelo ícone de usuário no topo do Painel; o Acervo abre por um atalho no Painel.
- Decisões (solicitar, cancelar pedido, entrar/sair da fila, renovar, remover aluno, remover livro, remover passkey, registrar devolução e pagamento) sempre passam por um `BottomSheet` de confirmação.

## Componentes por fluxo

- **Acervo:** `SearchBar` (sem filtro), `BookCard`, `BookCover`, `StatusBadge`. `Chip` só no acervo do bibliotecário.
- **Acesso e cadastro:** `TextField`, `Stepper`, `CodeInput`, `Alert`, `EmptyState` (passkey criado), `Button`.
- **Salvos e conta:** `FolderCard`, `ListRow`, `Toggle`, `BottomSheet`.
- **Fila:** `QueueInfo`, `DeadlineChip`, `LoanTimeline`, `BottomSheet`.
- **Empréstimos:** `SegmentedTabs`, `LoanCard`, `FineCard`, `Alert`, `QRPass`.
- **Assistente:** `ChatBubble`, `ChatComposer`, `PromptSugerido` como perguntas prontas, `BookCard` como sugestão.
- **Bibliotecário:** `StatTile`, `QueueManagerRow`, `FineRow`, `TextField` de matrícula como alternativa ao QR, `NotificationItem`, `Toggle` (multa paga agora).
- **Geral:** `AppBar`, `BottomNav`, `Button`, `TextField`, `Avatar`, `EmptyState`, `Toast` (resultado de uma ação).

## Nomes no Figma e no código

O arquivo do Figma tem os mesmos tokens, estilos e componentes. Alguns nomes de variante diferem:

| Componente | Código | Figma |
| --- | --- | --- |
| `StatusBadge` | `disponivel`, `aguardando`, `retirar`, `ativo`, `vence`, `fila` | Disponível, Confirme, Pronto para retirar, Em andamento, Vence em breve, Na fila |
| `Button` | `size` sm/md/lg; `disabled` é propriedade | Small/Medium (sem Large); Disabled é variante |
| `Alert` | `tone` info/success/warning/danger | Info/Sucesso/Aviso/Perigo |
| `DeadlineChip` | `kind` confirmar, retirar… | Tom em inglês |
| `BookCover` | `size` sm/md/lg | P/M/G |

`CodeInput`, `ListRow`, `FolderCard`, `Stepper` e `FineRow` existem aqui como componentes e no Figma como frames soltos dentro das telas.
