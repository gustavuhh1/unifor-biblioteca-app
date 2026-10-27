import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { ApiError } from '@/shared/api/errors'
import { AppBar, Button, EmptyState, TextField } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { StudentRecord } from '../components/student-record'
import { DESK_MESSAGE } from '../desk.constants'
import { lookupBodyFromInput } from '../desk.format'
import { useDeskLookup } from '../hooks/use-desk-lookup'
import { useDeskStudent } from '../hooks/use-desk-student'

// Identificar aluno (B04 e B05, RF-BAL-02 e RF-BAL-03): sem QR, a pessoa digita a
// matrícula ou o código do pedido e abre a mesma ficha que o QR abre
// (POST /librarian/desk/lookup). Com `matricula` na rota (vindo do QR ou da
// lista Retiradas), a ficha já abre pronta. Dali se registra a retirada e a
// devolução.
export function IdentifyStudentScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { matricula } = useLocalSearchParams<{ matricula?: string }>()
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const lookup = useDeskLookup()
  const record = useDeskStudent(matricula)

  function search() {
    const body = lookupBodyFromInput(input)
    if (!body) {
      setInputError(DESK_MESSAGE.invalidSearch)
      return
    }
    setInputError(null)
    lookup.mutate(body, {
      onSuccess: (found) =>
        router.setParams({ matricula: found.student.matricula }),
    })
  }

  const lookupError =
    lookup.error instanceof ApiError ? lookup.error.message : undefined

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Identificar aluno"
        subtitle="Sem QR: pela matrícula ou código"
        back
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        <TextField
          label="Matrícula ou código do pedido"
          icon="search"
          value={input}
          onChangeText={(value) => {
            setInput(value)
            setInputError(null)
            lookup.reset()
          }}
          onSubmitEditing={search}
          returnKeyType="search"
          autoCapitalize="characters"
          hint="Ex.: 2412858 ou RET-4821"
          error={inputError ?? lookupError}
        />
        <Button
          block
          variant="secondary"
          loading={lookup.isPending}
          onPress={search}
        >
          Buscar aluno
        </Button>
        {matricula ? (
          record.isPending ? (
            <View
              accessibilityLabel="Abrindo a ficha do aluno"
              className="items-center py-6"
            >
              <ActivityIndicator color={colors.brand} />
            </View>
          ) : record.isError ? (
            <EmptyState
              icon="alert"
              title="Não foi possível abrir a ficha"
              text={
                record.error instanceof ApiError
                  ? record.error.message
                  : undefined
              }
              action={
                <Button icon="refresh" onPress={() => void record.refetch()}>
                  Tentar de novo
                </Button>
              }
            />
          ) : (
            <StudentRecord
              record={record.data}
              onPickup={(loanId) =>
                router.push({
                  pathname: '/register-pickup',
                  params: { loanId, matricula },
                })
              }
              onReturn={(loanId) =>
                router.push({
                  pathname: '/register-return',
                  params: { loanId, matricula },
                })
              }
            />
          )
        ) : null}
      </ScrollView>
    </View>
  )
}
