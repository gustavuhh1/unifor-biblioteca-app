import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  AppBar,
  Button,
  Icon,
  BookCover,
  coverToneOf,
} from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
const pedidos = {
  'RET-4817': {
    nome: 'Beatriz Nogueira',
    matricula: '2311052',
    titulo: 'Padrões de Projeto',
    autor: 'Gamma et al.',
    estante: '005.1',
    registro: '51902',
  },
  'RET-4809': {
    nome: 'Rafael Teixeira',
    matricula: '2210478',
    titulo: 'Cálculo, Vol. 2',
    autor: 'James Stewart',
    estante: '515',
    registro: '51903',
  },
  'RET-4821': {
    nome: 'Lucas Almeida',
    matricula: '2412858',
    titulo: 'Código Limpo',
    autor: 'Robert C. Martin',
    estante: '005.1',
    registro: '46122',
  },
}
export type CodigoRetirada = keyof typeof pedidos
export interface RegistrarRetiradaProps {
  codigo?: CodigoRetirada
  onVoltar?: () => void
  onConcluido?: () => void
}
export function RegisterPickupScreen({
  codigo = 'RET-4817',
  onVoltar,
  onConcluido,
}: RegistrarRetiradaProps) {
  const safe = useSafeAreaInsets()
  const [confirmar, setConfirmar] = useState(false)
  const [feito, setFeito] = useState(false)
  const pedido = pedidos[codigo]
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Registrar retirada" back onBack={onVoltar} />
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        <View className="flex-row gap-3 rounded-lg bg-success-soft p-4">
          <Icon name="qr" color="success" />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">QR lido: {codigo}</Text>
            <Text className="text-body text-ink-muted">
              Pedido confirmado pela aluna e sem pendências. Entregue o exemplar
              e registre.
            </Text>
          </View>
        </View>
        <View className="gap-4 rounded-lg border border-line bg-surface-raised p-4">
          <Text className="text-label text-ink">{pedido.nome}</Text>
          <Text className="text-caption text-ink-muted">
            Matrícula {pedido.matricula}
          </Text>
          <View className="flex-row gap-3">
            <BookCover
              title={pedido.titulo}
              author={pedido.autor}
              tone={coverToneOf(
                codigo === 'RET-4821'
                  ? 'cover1'
                  : codigo === 'RET-4809'
                    ? 'cover4'
                    : 'cover2',
              )}
              size="md"
            />
            <View className="min-w-0 flex-1 gap-2">
              <Text className="text-book-title text-ink">{pedido.titulo}</Text>
              <Text className="text-caption text-ink-muted">
                {pedido.autor}
              </Text>
              <Text className="text-caption text-ink-muted">
                Registro {pedido.registro} · Estante {pedido.estante}
              </Text>
              <Text className="text-overline text-brand">
                Pronto para retirar
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row justify-between gap-3 rounded-md bg-brand-soft p-4">
          <Text className="text-caption text-ink">Empréstimo de 14 dias</Text>
          <Text className="text-caption-strong text-ink">
            Devolver até 29/10
          </Text>
        </View>
        {feito ? (
          <Text
            accessibilityLiveRegion="polite"
            className="rounded-md bg-success-soft p-4 text-label text-success"
          >
            Retirada registrada na simulação.
          </Text>
        ) : null}
      </ScrollView>
      <View
        className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(safe.bottom, 16) }}
      >
        <Button
          block
          icon="check"
          disabled={feito}
          onPress={() => setConfirmar(true)}
        >
          {feito ? 'Registrado' : 'Registrar entrega'}
        </Button>
        <Button block variant="ghost" onPress={onVoltar}>
          Cancelar
        </Button>
      </View>
      <ConfirmationSheet
        visible={confirmar}
        title="Confirmar retirada?"
        description="Demonstração: confirmar a entrega presencial do exemplar. Nenhum dado será enviado."
        onCancel={() => setConfirmar(false)}
        onConfirm={() => {
          setConfirmar(false)
          setFeito(true)
          onConcluido?.()
        }}
      />
    </View>
  )
}
