import React, { useState } from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '@/shared/components/button'
import { TextField } from '@/shared/components/text-field'

export interface LoginBibliotecarioProps {
  erro?: boolean
  onEntrar?: () => void
  onAluno?: () => void
  onEsqueciSenha?: () => void
}
export function LibrarianLoginScreen({
  erro = false,
  onEntrar,
  onAluno,
  onEsqueciSenha,
}: LoginBibliotecarioProps) {
  const safe = useSafeAreaInsets()
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [erroCampo, setErroCampo] = useState(false)
  function enviar() {
    if (!/^\d{7}$/.test(matricula) || !senha) {
      setErroCampo(true)
      return
    }
    setErroCampo(false)
    onEntrar?.()
  }
  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingTop: safe.top + 20,
          paddingBottom: safe.bottom + 24,
          gap: 16,
        }}
      >
        <View className="items-center gap-2 pb-6">
          <Image
            source={require('../../../../assets/logo-unifor.png')}
            style={{ width: 73, height: 78 }}
            resizeMode="contain"
          />
          <Text className="text-title-lg text-ink">Unifor Biblioteca</Text>
          <Text className="text-body text-ink-muted">
            Acesso do bibliotecário
          </Text>
        </View>
        {erro || erroCampo ? (
          <View className="rounded-md border border-danger bg-danger-soft p-3">
            <Text className="text-label text-danger">
              Não foi possível entrar. Confira a matrícula e a senha.
            </Text>
          </View>
        ) : null}
        <TextField
          label="Matrícula"
          icon="user"
          value={matricula}
          onChangeText={(v) => setMatricula(v.replace(/\D/g, ''))}
          inputMode="numeric"
          maxLength={7}
          autoCapitalize="none"
          error={
            erroCampo && !/^\d{7}$/.test(matricula)
              ? 'Informe os 7 dígitos da matrícula.'
              : undefined
          }
        />
        <TextField
          label="Senha"
          icon="lock"
          type="password"
          value={senha}
          onChangeText={setSenha}
          error={erroCampo && !senha ? 'Informe a senha.' : undefined}
        />
        <Button block variant="ghost" onPress={onEsqueciSenha}>
          Esqueci minha senha
        </Button>
        <Button block onPress={enviar}>
          Entrar
        </Button>
        <Pressable
          onPress={onAluno}
          className="min-h-[44px] items-center justify-center"
        >
          <Text className="text-label text-brand">Acessar como aluno</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}
