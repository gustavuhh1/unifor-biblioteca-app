import React, { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppBar } from '@/shared/components/app-bar'
import { Button } from '@/shared/components/button'
import { TextField } from '@/shared/components/text-field'
import {
  institutionalEmailSchema,
  newPasswordSchema,
} from '@/features/auth/schemas/registration.schemas'

type EstadoCadastro = 'normal' | 'validacao' | 'conta-existente'
export interface CadastroProps {
  estado?: EstadoCadastro
  onVoltar?: () => void
  onContinuar?: () => void
  onEntrar?: () => void
}

export function SignupScreen({
  estado = 'normal',
  onVoltar,
  onContinuar,
  onEntrar,
}: CadastroProps) {
  const safe = useSafeAreaInsets()
  const [email, setEmail] = useState('')
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [tentar, setTentar] = useState(estado !== 'normal')
  const [jaExiste, setJaExiste] = useState(estado === 'conta-existente')
  const erroEmail =
    tentar && !institutionalEmailSchema.safeParse(email.trim()).success
  const erroMatricula = tentar && !/^\d{7}$/.test(matricula)
  const erroSenha = tentar && !newPasswordSchema.safeParse(senha).success
  const erroConfirmacao = tentar && confirmacao !== senha
  function continuar() {
    setTentar(true)
    if (
      !institutionalEmailSchema.safeParse(email.trim()).success ||
      !/^\d{7}$/.test(matricula) ||
      !newPasswordSchema.safeParse(senha).success ||
      senha !== confirmacao
    )
      return
    if (jaExiste) return
    onContinuar?.()
  }
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Criar conta" back onBack={onVoltar} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        <View className="flex-row gap-2">
          {['Dados', 'E-mail', 'Passkey'].map((s, i) => (
            <View key={s} className="flex-1 gap-2">
              <Text
                className={
                  i === 0
                    ? 'text-caption-strong text-brand'
                    : 'text-caption text-ink-muted'
                }
              >
                {s}
              </Text>
              <View
                className={`h-1.5 rounded-pill ${i === 0 ? 'bg-brand' : 'bg-line'}`}
              />
            </View>
          ))}
        </View>
        <TextField
          label="E-mail institucional"
          icon="mail"
          value={email}
          onChangeText={(v) => {
            setEmail(v)
            setJaExiste(false)
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          hint={
            !erroEmail && !jaExiste ? 'Terminado em @edu.unifor.br.' : undefined
          }
          error={
            erroEmail
              ? 'Use o e-mail institucional, terminado em @edu.unifor.br.'
              : jaExiste
                ? 'Este e-mail já tem conta. Entre ou recupere a senha.'
                : undefined
          }
        />
        <TextField
          label="Matrícula"
          icon="user"
          value={matricula}
          onChangeText={(v) => setMatricula(v.replace(/\D/g, ''))}
          inputMode="numeric"
          maxLength={7}
          hint={
            !erroMatricula
              ? '7 dígitos. Os dois primeiros são o ano de ingresso.'
              : undefined
          }
          error={
            erroMatricula
              ? 'A matrícula tem 7 dígitos.'
              : jaExiste
                ? 'Esta matrícula já tem conta.'
                : undefined
          }
        />
        <TextField
          label="Senha"
          icon="lock"
          type="password"
          value={senha}
          onChangeText={setSenha}
          hint={!erroSenha ? 'Use pelo menos 8 dígitos numéricos.' : undefined}
          error={
            erroSenha
              ? 'Use uma senha numérica de pelo menos 8 dígitos.'
              : undefined
          }
        />
        <TextField
          label="Confirmar senha"
          icon="lock"
          type="password"
          value={confirmacao}
          onChangeText={setConfirmacao}
          hint={!erroConfirmacao ? 'Repita a senha.' : undefined}
          error={erroConfirmacao ? 'As senhas não são iguais.' : undefined}
        />
        {jaExiste ? (
          <Pressable
            onPress={onEntrar}
            className="rounded-md bg-danger-soft p-3"
          >
            <Text className="text-label text-danger">
              Já existe uma conta com esses dados. Toque para entrar.
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
      <View
        className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(safe.bottom, 16) }}
      >
        <Button block onPress={continuar}>
          Continuar
        </Button>
        <Button block variant="ghost" onPress={onEntrar}>
          Já tem conta? Entrar
        </Button>
      </View>
    </View>
  )
}
