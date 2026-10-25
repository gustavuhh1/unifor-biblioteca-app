import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { AppBar, Button, Icon } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'

export function AssistantScreen() {
  const { colors } = useTheme()
  const params = useLocalSearchParams<{ state?: string }>()
  const router = useRouter()
  const blocked = params.state === 'fine-blocked'
  const replyError = params.state === 'reply-error'
  // A48 é a conversa sobre recomendações; os estados A72 e A81 ficam nos outros ramos.
  const readingHelp = params.state === 'reading-help'
  const [confirmed, setConfirmed] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Assistente"
        subtitle="Dúvidas sobre o app e sugestões de leitura"
        actions={[
          {
            icon: 'refresh',
            label: 'Nova conversa',
            onPress: () => {
              setConfirmed(false)
              setCancelled(false)
              setMessage('')
              if (blocked || readingHelp || replyError)
                router.setParams({ state: '' })
            },
          },
        ]}
      />
      <ScrollView
        className="flex-1 border-t border-line"
        contentContainerClassName={`flex-grow gap-3 px-4 pb-3 pt-3 ${blocked ? 'justify-end' : ''}`}
      >
        {readingHelp || replyError ? (
          <>
            {replyError ? (
              <UserMessage time="19:41">Como funciona a fila?</UserMessage>
            ) : (
              <View className="h-4" />
            )}
            <AssistantMessage time="19:41">
              Se o livro estiver emprestado, você entra na fila e vê quantas
              pessoas estão na frente. Quando chegar sua vez, tem 24h para
              confirmar e 2 dias úteis para retirar.
            </AssistantMessage>
            <UserMessage time="19:43">
              Me indica algo parecido com Código Limpo
            </UserMessage>
            {replyError ? (
              <>
                <AssistantMessage time="19:43">
                  Não consegui responder agora. Confira sua conexão e tente de
                  novo.
                </AssistantMessage>
                <Button
                  size="sm"
                  variant="secondary"
                  onPress={() => router.setParams({ state: 'reading-help' })}
                >
                  Tentar de novo
                </Button>
              </>
            ) : (
              <>
                <AssistantMessage time="19:43">
                  Você tem lido bastante sobre boas práticas. Este está
                  disponível agora:
                </AssistantMessage>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push('/book-details')}
                  className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-3"
                >
                  <View className="h-[124px] w-[86px] justify-between rounded-md bg-cover-2 p-2">
                    <Text className="font-serif text-label text-on-cover">
                      Refatora-ção
                    </Text>
                    <Text className="text-micro-strong text-on-cover">
                      MARTIN FOWLER
                    </Text>
                  </View>
                  <View className="flex-1 gap-1 pt-1">
                    <Text className="font-serif text-title text-ink">
                      Refatoração
                    </Text>
                    <Text className="text-caption text-ink-muted">
                      Martin Fowler
                    </Text>
                    <Text className="text-caption text-ink-muted">
                      Pelo que você leu
                    </Text>
                  </View>
                </Pressable>
              </>
            )}
          </>
        ) : (
          <>
            <View className="max-w-[85%] self-end rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-brand px-4 py-2.5">
              <Text className="text-body text-on-brand">
                Quero pegar o Refatoração
              </Text>
            </View>
            <Text className="self-end text-micro text-ink-muted">19:44</Text>
            <View className="flex-row items-center gap-1">
              <Icon name="sparkle" size={15} color="brand" />
              <Text className="text-caption-strong text-brand">Assistente</Text>
            </View>
            {blocked ? (
              <View className="rounded-bl-lg rounded-br-lg rounded-tr-lg border border-line bg-surface-raised p-3">
                <Text className="text-body text-ink">
                  Não consigo solicitar agora: você está com Cálculo, Vol. 1 em
                  atraso desde 10/10 (multa de R$ 6,00). Devolva no balcão da
                  biblioteca para voltar a pedir livros e entrar em filas.
                </Text>
              </View>
            ) : (
              <>
                <View className="rounded-bl-lg rounded-br-lg rounded-tr-lg border border-line bg-surface-raised p-3">
                  <Text className="text-body text-ink">
                    Posso solicitar este empréstimo para você. Confira antes de
                    eu fazer. Só solicito depois da sua confirmação.
                  </Text>
                </View>
                <Text className="text-micro text-ink-muted">19:44</Text>
                {!cancelled ? (
                  <View className="gap-3 rounded-lg border-[1.5px] border-brand bg-surface-raised p-4">
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => router.push('/book-details')}
                      className="gap-1"
                    >
                      <Text className="text-label text-ink">Refatoração</Text>
                      <Text className="text-caption text-ink-muted">
                        Martin Fowler
                      </Text>
                    </Pressable>
                    {confirmed ? (
                      <View className="flex-row items-center gap-2 rounded-md bg-success-soft p-3">
                        <Icon name="check" size={18} color="success" />
                        <Text className="flex-1 text-label-sm text-ink">
                          Solicitação enviada. Confira seus empréstimos para
                          acompanhar.
                        </Text>
                      </View>
                    ) : (
                      <>
                        <View className="flex-row items-center justify-between border-b border-line py-2">
                          <Text className="text-body-sm text-ink-muted">
                            Retirar até
                          </Text>
                          <Text className="text-label-sm text-ink">
                            seg, 19/10 (2 dias úteis)
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between border-b border-line py-2">
                          <Text className="text-body-sm text-ink-muted">
                            Seus empréstimos
                          </Text>
                          <Text className="text-label-sm text-ink">
                            passa a 4 de 10
                          </Text>
                        </View>
                        <Button
                          block
                          icon="check"
                          onPress={() => setConfirmed(true)}
                        >
                          Confirmar solicitação
                        </Button>
                        <Button
                          block
                          variant="ghost"
                          onPress={() => setCancelled(true)}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </View>
                ) : (
                  <View className="self-end rounded-lg bg-brand-soft px-4 py-2">
                    <Text className="text-body text-ink">
                      Tudo bem, não vou solicitar.
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
        {blocked ? (
          <Text className="self-start text-micro text-ink-muted">19:44</Text>
        ) : null}
      </ScrollView>
      <View className="flex-row items-start gap-2 border-t border-line bg-surface px-4 py-2">
        <Icon name="info" size={15} color="inkMuted" />
        <Text className="flex-1 text-micro text-ink-muted">
          O Assistente usa IA e pode errar. Confira prazos e regras na página do
          livro e em Meus empréstimos.
        </Text>
      </View>
      <View className="flex-row items-center gap-2 border-t border-line bg-surface-raised px-3 py-2">
        <TextInput
          accessibilityLabel="Pergunte sobre livros ou empréstimos"
          placeholder="Pergunte sobre livros ou empréstimos"
          placeholderTextColor={colors.inkMuted}
          value={message}
          onChangeText={setMessage}
          className="h-11 flex-1 rounded-pill bg-surface-sunken px-4 text-body text-ink"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enviar mensagem"
          onPress={() => setMessage('')}
          className="size-11 items-center justify-center rounded-pill bg-brand"
        >
          <Icon name="send" size={20} color="onBrand" />
        </Pressable>
      </View>
    </View>
  )
}

function AssistantMessage({
  time,
  children,
}: {
  time: string
  children: string
}) {
  return (
    <>
      <View className="flex-row items-center gap-1">
        <Icon name="sparkle" size={15} color="brand" />
        <Text className="text-caption-strong text-brand">Assistente</Text>
      </View>
      <View className="rounded-bl-lg rounded-br-lg rounded-tr-lg border border-line bg-surface-raised p-3">
        <Text className="text-body text-ink">{children}</Text>
      </View>
      <Text className="text-micro text-ink-muted">{time}</Text>
    </>
  )
}

function UserMessage({ time, children }: { time: string; children: string }) {
  return (
    <>
      <View className="max-w-[85%] self-end rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-brand px-4 py-2.5">
        <Text className="text-body text-on-brand">{children}</Text>
      </View>
      <Text className="self-end text-micro text-ink-muted">{time}</Text>
    </>
  )
}
