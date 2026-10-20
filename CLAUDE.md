# Unifor Biblioteca — App (regras para o Claude Code)

Este repositório é o app mobile do Unifor Biblioteca (React Native com Expo), com dois perfis: **aluno** e **bibliotecário**. O dono é o Gustavo, estudante da Unifor. O app é o projeto de conclusão de duas cadeiras:

- **Técnicas de Integração de Sistemas:** apresentação em **29/10/2026**. A API (repositório `unifor-biblioteca-api`) é demonstrada ao vivo **por meio deste app**, então o app completo precisa funcionar nessa data.
- **Desenvolvimento Mobile:** entrega em **09/11/2026**. Apresentação num celular Android físico.

Fale com o Gustavo em **português**, de forma direta, um passo por vez.

## Antes de qualquer tarefa

Leia os documentos de `docs/`. Eles são a fonte da verdade, e o escopo está **fechado**:

| Arquivo | Para quê |
|---|---|
| `docs/escopo.md` | O que entra e o que fica fora, regras de negócio, autenticação e decisões |
| `docs/requisitos.md` | Os 85 RF e 28 RNF, com código e prioridade |
| `docs/regras-e-decisoes.md` | Regras de negócio e decisões de design e de telas (inclui as de 18 e 19/10) |
| `docs/modelo-de-dados-firestore.md` | Formato dos dados que a API devolve (o app nunca acessa o Firestore) |
| `docs/design-system/` | Tokens (`tokens.json`), regras de uso (`README.md`) e a API dos componentes (`components.d.ts`) |
| `docs/api-openapi.json` | Contrato das rotas já prontas da API (gerado do Swagger). Rotas novas: consulte `/docs` da API rodando |
| `docs/infra.md` | Domínios, pacote Android, passkey e nomes de variáveis (sem valores secretos) |

Telas de referência: Figma (https://www.figma.com/design/Xg3hlqOp5v0XGT7P7ZooIp) e canvas (https://claude.ai/artifact/JM6M43nJfcTZdfeV6uRckY). Os códigos das telas (A07, B04…) são os mesmos nos dois.

Se dois documentos se contradizem, ou se uma tarefa exige algo que não está neles, **pare e pergunte ao Gustavo**. Não escolha sozinho.

## Escopo: o que não fazer

- Não implemente nada da lista **Fora** do escopo.
- Não crie tela, fluxo, campo ou regra que não esteja nos documentos ou no design. Melhorias ficam como sugestão para o Gustavo.
- Não invente visual: só tokens e componentes do design system.
- O app **nunca** acessa o Firestore. Todo dado passa pela API. A única exceção é o Firebase Authentication (login com matrícula e senha, sessão e `signInWithCustomToken` depois do passkey).
- Não troque bibliotecas da stack nem adicione dependências sem perguntar.

## Stack (decidida em 20/10)

- **Expo** (SDK atual) + **React Native** + **TypeScript** (`strict`). Build de desenvolvimento (`npx expo run:android`); passkey não roda no Expo Go.
- **Expo Router** para navegação, com as rotas em `src/app/`.
- **NativeWind** (Tailwind) para estilo. O `tailwind.config` **substitui** (não estende) cores, espaçamentos, raios, tipografia e sombras pelos valores de `docs/design-system/tokens.json`, para que nenhuma classe fora do design system exista. Tema claro e escuro com variáveis CSS em `src/global.css` (os dois valores de cada token).
- **TanStack Query** para dados da API (carregando, erro, cache, invalidação depois de ações). Estado global mínimo com Context: só sessão e tema.
- **react-hook-form** + **zod** para formulários.
- **Firebase JS SDK** (só Auth), **react-native-passkey** para o passkey.
- **date-fns** + **@date-fns/tz**: datas sempre em `America/Fortaleza`, formatadas em pt-BR.
- **Jest** (`jest-expo`) só com **testes unitários** (regras, hooks e utilitários). Sem testes de ponta a ponta.
- **ESLint + Prettier**, Prettier com `"semi": false` (**sem ponto e vírgula**).

## Estrutura do projeto

```
src/
  app/                         # SÓ rotas do Expo Router (arquivos finos: montam a tela da feature)
    _layout.tsx                # provedores (Query, sessão, tema) e guarda de sessão
    (auth)/                    # abertura, login, outras formas, cadastro, recuperar senha
    (student)/                 # abas do aluno: Início, Acervo, Empréstimos, Assistente, Perfil
    (librarian)/               # abas do bibliotecário: Painel, Retiradas, Escanear, Filas, Multas
  features/<feature>/          # auth, catalog, loans, queues, fines, desk, saved, notifications, assistant, profile
    screens/                   # telas da feature (uma por código do design: A62, B07…)
    components/                # componentes exclusivos da feature
    api/                       # chamadas da API desta feature (usam shared/api/client)
    hooks/                     # hooks do TanStack Query e de regra de tela
    schemas/                   # schemas zod dos formulários
    <feature>.types.ts         # tipos EXCLUSIVOS da feature
    __tests__/
  shared/
    api/                       # cliente HTTP único (ID token, base URL, erros da API)
    components/                # componentes do design system (Button, TextField, AppBar, BookCard…)
    theme/                     # tokens em TS (para o que não é classe), provedor de tema
    types/                     # tipos fundamentais (espelho de unifor-biblioteca-api/src/shared/types)
    hooks/  utils/  config/    # utilidades, datas, env, firebase
```

Regras:
- Arquivos de `src/app/` não têm lógica: importam a tela de `features/<feature>/screens`.
- Tela não chama `fetch`: usa um hook da feature, que usa `features/<feature>/api`, que usa `shared/api/client`.
- **Tipos fundamentais** (documentos e enums do modelo de dados) só em `src/shared/types`, como espelho dos tipos da API. Quando a API mudar um tipo, o espelho muda no mesmo PR do app. Tipos exclusivos da feature em `<feature>.types.ts`.
- Componentes do design system só em `src/shared/components`, com as mesmas props de `docs/design-system/components.d.ts`. Telas não recriam botão, campo, card etc.
- Nenhuma cor, espaço, raio ou tamanho de fonte escrito à mão: só classes geradas dos tokens.

## Sem redundância

- Antes de criar uma função, tipo, constante, componente, schema ou texto, procure no projeto (`src/shared` e a feature) se já existe algo igual ou parecido. Se existir, reutilize; se for quase igual, generalize o que existe.
- Nada é declarado duas vezes. Valores de enums vêm das constantes de `src/shared/types` (ex.: `LOAN_STATUS.awaitingPickup`), nunca como texto solto.
- Duas funções ou componentes com o mesmo objetivo e nomes diferentes são proibidos.
- No fim de cada tarefa, informe o que reutilizou e se encontrou duplicação; se não removeu, diga onde.

## Sessão e erros da API

- O app manda o ID token do Firebase em `Authorization: Bearer`. O cliente HTTP renova o token pelo SDK.
- **Sair:** chama `POST /auth/logout` (revoga a sessão na API) e depois `signOut` do Firebase. Os dois, sempre, nessa ordem; se a API falhar, sai do Firebase mesmo assim.
- **401:** vai para o login com o aviso de sessão expirada (tela A79). **403:** mensagem de acesso negado.
- Erros da API chegam como `{ code, message, fields?, retryAfterSeconds? }`. O app mostra `message` (já em português); `fields` marca os campos do formulário; `retryAfterSeconds` alimenta o contador "Reenviar em".

## Convenções

- **Nomes no código** (variáveis, funções, arquivos, componentes) em **inglês**. **Comentários e textos dos testes (`describe`/`it`) em português (pt-BR)**, por decisão do Gustavo em 20/10. **README em inglês** (exigência da cadeira de Mobile). **Interface em português.**
- **Commits em português**, curtos e no imperativo. Uma **branch curta por tarefa** com PR para a `main`. **Não faça push nem abra PR sem o Gustavo pedir.**
- Cite no PR os requisitos e os códigos de tela atendidos (ex.: `RF-AUT-05`, `A62`).
- Acessibilidade mínima: alvos de toque de 44 px, `accessibilityLabel` em ícones sem texto, contraste dos tokens.

## Segredos e assinatura

- Nunca escreva chave, senha ou token no código, em testes, em logs ou em documentos. Nunca peça ao Gustavo para colar uma chave na conversa.
- A chave de assinatura do Android (keystore) e as senhas dela ficam **fora do repositório**. O repositório só tem os nomes das variáveis em `.env.example`.
- O SHA-256 dessa chave vai no `assetlinks.json` (repositório da API, pasta do Hosting) e a origem `android:apk-key-hash:` vai no `PASSKEY_ANDROID_ORIGINS` da API.
- O repositório é **público**: confira o `git diff` antes de cada commit.

## Ambientes

- Desenvolvimento no emulador Android (Pixel 6a, API 34, Google Play). O computador é `10.0.2.2` dentro do emulador: API em `:8080`, Auth emulator em `:9099`. O Metro usa a `:8081`; o Firestore emulator da API fica na `:8085`.
- A base da API e os hosts do emulador vêm de variáveis `EXPO_PUBLIC_*`, nunca escritas nas telas.

## Comandos

- `npx expo run:android`: build de desenvolvimento no emulador
- `npm start`: Metro
- `npm test`: testes unitários
- `npm run lint` / `npm run format` / `npm run typecheck`
