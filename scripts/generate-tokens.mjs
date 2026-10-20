// Gera, a partir de docs/design-system/tokens.json, tudo que depende dos tokens:
//   - tailwind.config.js                    (cores, espaços, raios e estilos de texto)
//   - src/global.css                        (variáveis CSS dos temas claro e escuro)
//   - src/shared/theme/tokens.generated.ts  (cores e sombras em TS, para o que não é classe)
//   - src/shared/theme/fonts.generated.ts   (fontes que o _layout carrega)
// Para mudar o design system: troque o tokens.json e rode `npm run tokens`.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(
  await readFile(resolve(root, 'docs/design-system/tokens.json'), 'utf8'),
)

const HEADER =
  '@generated por scripts/generate-tokens.mjs a partir de docs/design-system/tokens.json. Não edite: rode `npm run tokens`.'

const THEMES = tokens.color.themes.map((theme) => theme.id)
const LIGHT = THEMES[0]
const DARK = THEMES[1]

// Nomes das fontes do pacote @expo-google-fonts, pelo peso (400 -> Regular).
const WEIGHT_NAMES = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
}

const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
const px = (value) => Number.parseFloat(value)

// --- Cores --------------------------------------------------------------------

// Um token de cor é fixo (texto) ou muda com o tema (objeto claro/escuro).
const colorTokens = tokens.color.tokens.map((token) => ({
  name: token.name,
  themed: typeof token.value === 'object',
  light: typeof token.value === 'object' ? token.value[LIGHT] : token.value,
  dark: typeof token.value === 'object' ? token.value[DARK] : token.value,
}))

const colors = { transparent: 'transparent' }
for (const token of colorTokens) {
  colors[token.name] = token.themed ? `var(--${token.name})` : token.light
}

function themeBlock(selector, theme) {
  const lines = colorTokens
    .filter((token) => token.themed)
    .map((token) => `  --${token.name}: ${token[theme]};`)
  return `${selector} {\n${lines.join('\n')}\n}`
}

const globalCss = `/* ${HEADER} */
@tailwind base;
@tailwind components;
@tailwind utilities;

${themeBlock(':root', LIGHT)}

${themeBlock('.dark:root', DARK)}
`

// --- Espaço e raio --------------------------------------------------------------

// "space-1-5" vira a chave "1.5" (classe p-1.5), a mesma convenção do Tailwind.
const spacing = { 0: '0px' }
for (const token of tokens.spacing.tokens) {
  spacing[token.name.replace(/^space-/, '').replace('-', '.')] = token.value
}

const borderRadius = { none: '0px' }
for (const token of tokens.radius.tokens) {
  borderRadius[token.name.replace(/^radius-/, '')] = token.value
}

// --- Tipografia -----------------------------------------------------------------

const FAMILY_NAME = Object.fromEntries(
  Object.entries(tokens.type.families).map(([key, stack]) => [
    key,
    stack.split(',')[0].replaceAll('"', '').trim(),
  ]),
)

const usedFonts = new Map()
const textUtilities = {}
for (const group of tokens.type.groups) {
  for (const style of group.styles) {
    const family = FAMILY_NAME[group.family]
    const weight = Number(style.fontWeight)
    const fontFamily = `${family}_${weight}${WEIGHT_NAMES[weight]}`
    usedFonts.set(fontFamily, { family, weight })

    const utility = {
      fontFamily,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
    }
    if (style.letterSpacing) {
      // O React Native não entende "em": converte para px pelo tamanho da fonte.
      const letterSpacing = px(style.letterSpacing) * px(style.fontSize)
      utility.letterSpacing = `${Number(letterSpacing.toFixed(2))}px`
    }
    if (/caixa alta/i.test(style.usage ?? '')) {
      utility.textTransform = 'uppercase'
    }
    textUtilities[`.text-${style.name}`] = utility
  }
}

// --- Sombras (só em TS: o NativeWind não monta sombras com várias camadas) --------

const shadows = {}
for (const theme of THEMES) {
  shadows[theme] = {}
  for (const token of tokens.shadow.tokens) {
    shadows[theme][camel(token.name.replace(/^shadow-/, ''))] =
      typeof token.value === 'object' ? token.value[theme] : token.value
  }
}

// --- tailwind.config.js ---------------------------------------------------------

const tailwindConfig = `// ${HEADER}
const plugin = require('tailwindcss/plugin')

// Estilos de texto do design system: classes text-body, text-title, text-book-title...
const textUtilities = ${JSON.stringify(textUtilities)}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  // "theme" (e não "theme.extend") substitui a paleta padrão do Tailwind: só
  // existem as classes dos tokens. As sombras ficam em src/shared/theme.
  theme: {
    colors: ${JSON.stringify(colors)},
    spacing: ${JSON.stringify(spacing)},
    borderRadius: ${JSON.stringify(borderRadius)},
    fontSize: {},
    fontFamily: {},
    fontWeight: {},
    letterSpacing: {},
    lineHeight: {},
    boxShadow: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(textUtilities)
    }),
  ],
}
`

// --- TS: cores e sombras ----------------------------------------------------------

const colorsByTheme = Object.fromEntries(
  THEMES.map((theme) => [
    theme,
    Object.fromEntries(
      colorTokens.map((token) => [camel(token.name), token[theme]]),
    ),
  ]),
)

const tokensTs = `// ${HEADER}
// Tokens do design system para o que não é classe (cor de ícone, StatusBar,
// sombras). O nome de cada cor é o do token em camelCase: surface-raised -> surfaceRaised.

export const THEME_IDS = ${JSON.stringify(THEMES)} as const
export type ThemeId = (typeof THEME_IDS)[number]

export const themeColors = ${JSON.stringify(colorsByTheme)} as const
export type ColorToken = keyof (typeof themeColors)['${LIGHT}']

export const themeShadows = ${JSON.stringify(shadows)} as const
export type ShadowToken = keyof (typeof themeShadows)['${LIGHT}']
`

// --- TS: fontes -------------------------------------------------------------------

const fontEntries = [...usedFonts.entries()].sort(([a], [b]) =>
  a.localeCompare(b),
)
const fontImports = fontEntries
  .map(
    ([name, { family, weight }]) =>
      `import { ${name} } from '@expo-google-fonts/${family.toLowerCase()}/${weight}${WEIGHT_NAMES[weight]}'`,
  )
  .join('\n')

const fontsTs = `// ${HEADER}
${fontImports}

// Fontes que o _layout carrega (useFonts). O nome de cada uma é o usado nas classes text-*.
export const fonts = {
${fontEntries.map(([name]) => `  ${name},`).join('\n')}
}
`

// --- Escrita ----------------------------------------------------------------------

async function write(relativePath, content) {
  const path = resolve(root, relativePath)
  const options = (await resolveConfig(path)) ?? {}
  const formatted = relativePath.endsWith('.css')
    ? content
    : await format(content, { ...options, filepath: path })
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, formatted)
  console.log(`gerado: ${relativePath}`)
}

await write('tailwind.config.js', tailwindConfig)
await write('src/global.css', globalCss)
await write('src/shared/theme/tokens.generated.ts', tokensTs)
await write('src/shared/theme/fonts.generated.ts', fontsTs)
