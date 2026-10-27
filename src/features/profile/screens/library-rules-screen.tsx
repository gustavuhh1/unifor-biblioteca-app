import { useState } from 'react'
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { ApiError } from '@/shared/api/errors'
import { Alert, AppBar, Button, EmptyState } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { buildRulesSections, contactLines } from '../library-info.format'
import { useLibraryInfo } from '../hooks/use-library-info'

// Regras da biblioteca (A52, RF-PER-02): resumo das regras com os números de
// GET /library/info, o atendimento, o botão da página oficial e o aviso de perda
// ou dano (o app só informa; não controla a reposição).
export function LibraryRulesScreen() {
  const { colors } = useTheme()
  const info = useLibraryInfo()
  const [linkError, setLinkError] = useState(false)

  function openOfficialPage(url: string) {
    setLinkError(false)
    Linking.openURL(url).catch(() => setLinkError(true))
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Regras da biblioteca" back />
      {info.isPending ? (
        <View
          accessibilityLabel="Carregando as regras"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : info.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível abrir as regras"
          text={info.error instanceof ApiError ? info.error.message : undefined}
          action={
            <Button icon="refresh" onPress={() => void info.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <Text className="text-body text-ink-muted">
            Para alunos de graduação
          </Text>
          {buildRulesSections(info.data).map((section) => (
            <View
              key={section.title}
              className="gap-2 rounded-lg border border-line bg-surface-raised p-4"
            >
              <Text className="text-label text-ink">{section.title}</Text>
              {section.lines.map((line) => (
                <Text key={line} className="text-body text-ink-muted">
                  {line}
                </Text>
              ))}
            </View>
          ))}
          <View className="gap-2 rounded-lg border border-line bg-surface-raised p-4">
            <Text className="text-label text-ink">Atendimento</Text>
            {contactLines(info.data).map((line) => (
              <Text key={line} className="text-body text-ink-muted">
                {line}
              </Text>
            ))}
          </View>
          <Button
            block
            variant="secondary"
            icon="externalLink"
            onPress={() => openOfficialPage(info.data.officialRulesUrl)}
          >
            Abrir página oficial da biblioteca
          </Button>
          {linkError ? (
            <Alert tone="danger">
              Não foi possível abrir a página. Confira sua conexão.
            </Alert>
          ) : null}
        </ScrollView>
      )}
    </View>
  )
}
