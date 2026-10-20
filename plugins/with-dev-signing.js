const { withAppBuildGradle } = require('expo/config-plugins')

// Já aplicado? (o prebuild pode rodar várias vezes sobre o mesmo android/)
const MARKER = 'UNIBOOKS_KEYSTORE_PATH'

// Bloco signingConfigs do build.gradle: usa o keystore próprio do projeto quando
// as variáveis de ambiente existem (lidas na hora do build, nada é gravado no
// arquivo). Sem elas, cai no debug.keystore público do Expo e avisa que o
// passkey não vai funcionar, porque o assetlinks.json só confia na chave própria.
const SIGNING_CONFIGS = `signingConfigs {
        debug {
            def devKeystore = System.getenv('UNIBOOKS_KEYSTORE_PATH')
            if (devKeystore) {
                storeFile file(devKeystore)
                storePassword System.getenv('UNIBOOKS_KEYSTORE_PASSWORD')
                keyAlias System.getenv('UNIBOOKS_KEY_ALIAS')
                keyPassword System.getenv('UNIBOOKS_KEY_PASSWORD')
            } else {
                logger.warn('UNIBOOKS_KEYSTORE_PATH não definida: usando o debug.keystore público do Expo. O passkey só funciona com o keystore próprio do projeto.')
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
            }
        }
    }`

// Config plugin: faz o build de desenvolvimento do Android ser assinado com o
// keystore próprio do projeto (fora do repositório). Roda em todo prebuild,
// então a assinatura sobrevive a recriar a pasta android/.
module.exports = function withDevSigning(config) {
  return withAppBuildGradle(config, (gradleConfig) => {
    const contents = gradleConfig.modResults.contents
    if (contents.includes(MARKER)) return gradleConfig

    const patched = contents.replace(
      /signingConfigs\s*\{\s*debug\s*\{[^}]*\}\s*\}/,
      SIGNING_CONFIGS,
    )
    if (patched === contents) {
      throw new Error(
        'with-dev-signing: não achei o bloco signingConfigs.debug no app/build.gradle. O template do Expo mudou?',
      )
    }
    gradleConfig.modResults.contents = patched
    return gradleConfig
  })
}
