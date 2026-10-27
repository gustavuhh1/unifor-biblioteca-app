import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState, type ComponentRef } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  Button,
  ChatBubble,
  ChatComposer,
  EmptyState,
  Icon,
  PromptSugerido,
} from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { useReducedMotion } from '@/shared/theme/use-reduced-motion'
import {
  ASSISTANT_DISCLAIMER_FALLBACK,
  ASSISTANT_MESSAGE,
  ASSISTANT_MESSAGE_MAX_LENGTH,
  ASSISTANT_NOW_INTERVAL_MS,
  ASSISTANT_QUICK_QUESTIONS,
} from '../assistant.constants'
import { errorText, fitMessage, previousQuestion } from '../assistant.format'
import { AssistantMessageItem } from '../components/assistant-message-item'
import {
  useCancelAssistantAction,
  useConfirmAssistantAction,
} from '../hooks/use-assistant-action'
import { useAssistantConversation } from '../hooks/use-assistant-conversation'
import { useNow } from '../hooks/use-now'
import { useSendAssistantMessage } from '../hooks/use-send-assistant-message'

// Assistente (A48 a A49, A72 e A81; RF-ASS-01 a RF-ASS-06): a conversa vem de
// GET /me/assistant/messages, cada pergunta vai por POST /me/assistant/messages
// e a ação que ele propõe só acontece depois do Confirmar. A rota aceita
// `?q=` com uma pergunta pronta (ex.: da busca sem resultado, RF-ACE-06).
export function AssistantScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { colors } = useTheme()
  const reducedMotion = useReducedMotion()
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  const { q } = useLocalSearchParams<{ q?: string }>()

  const conversation = useAssistantConversation()
  const send = useSendAssistantMessage()
  const confirm = useConfirmAssistantAction()
  const cancel = useCancelAssistantAction()
  const now = useNow(ASSISTANT_NOW_INTERVAL_MS)
  const [text, setText] = useState('')

  const { mutate: sendMessage } = send
  const loaded = conversation.isSuccess
  const items = conversation.data?.items ?? []
  const askedFromRoute = useRef(false)

  // Pergunta pronta que veio pela rota: manda uma vez, depois da conversa abrir.
  useEffect(() => {
    if (!q || askedFromRoute.current || !loaded) return
    askedFromRoute.current = true
    sendMessage(fitMessage(q))
    router.setParams({ q: '' })
  }, [q, loaded, sendMessage, router])

  function ask(raw: string) {
    const value = fitMessage(raw)
    if (!value || !loaded || send.isPending) return
    sendMessage(value)
    setText('')
  }

  // Estado dos botões e o erro do cartão da ação que está na vez.
  function actionState(actionId: string): {
    busy: 'confirm' | 'cancel' | null
    error: string | null
  } {
    const confirming = confirm.isPending && confirm.variables === actionId
    const cancelling = cancel.isPending && cancel.variables === actionId
    const confirmError =
      confirm.isError && confirm.variables === actionId
        ? errorText(confirm.error)
        : null
    const cancelError =
      cancel.isError && cancel.variables === actionId
        ? errorText(cancel.error)
        : null
    return {
      busy: confirming ? 'confirm' : cancelling ? 'cancel' : null,
      error: confirmError ?? cancelError,
    }
  }

  const waiting = send.isPending
  const sendFailed = send.isError

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-surface">
      <View style={{ paddingTop: insets.top }}>
        <View className="gap-1 border-b border-line px-4 pb-3 pt-3">
          <Text className="text-title-lg text-ink">Assistente</Text>
          <Text className="text-caption text-ink-muted">
            Dúvidas sobre o app e sugestões de leitura
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: !reducedMotion })
        }
        contentContainerClassName="gap-4 p-4"
      >
        {conversation.isPending ? (
          <View
            accessibilityLabel="Abrindo a conversa"
            className="items-center py-8"
          >
            <ActivityIndicator color={colors.brand} />
          </View>
        ) : conversation.isError ? (
          <EmptyState
            icon="alert"
            title={ASSISTANT_MESSAGE.loadFailed}
            text={
              conversation.error instanceof ApiError
                ? conversation.error.message
                : undefined
            }
            action={
              <Button
                icon="refresh"
                onPress={() => void conversation.refetch()}
              >
                Tentar de novo
              </Button>
            }
          />
        ) : (
          <>
            {items.length === 0 && !waiting && !sendFailed ? (
              <View className="gap-3">
                <ChatBubble>{ASSISTANT_MESSAGE.welcome}</ChatBubble>
                {ASSISTANT_QUICK_QUESTIONS.map((question) => (
                  <PromptSugerido
                    key={question}
                    text={question}
                    onPress={() => ask(question)}
                  />
                ))}
              </View>
            ) : null}

            {items.map((message, index) => {
              const state = message.action
                ? actionState(message.action.id)
                : { busy: null, error: null }
              return (
                <AssistantMessageItem
                  key={message.id}
                  message={message}
                  now={now}
                  retryText={previousQuestion(items, index)}
                  busy={state.busy}
                  actionError={state.error}
                  onRetry={ask}
                  onOpenBook={(id) =>
                    router.push({ pathname: '/book-details', params: { id } })
                  }
                  onConfirm={(id) => confirm.mutate(id)}
                  onCancel={(id) => cancel.mutate(id)}
                  onSeeLoans={() => router.push('/loans')}
                />
              )
            })}

            {(waiting || sendFailed) && send.variables ? (
              <ChatBubble from="user">{send.variables}</ChatBubble>
            ) : null}
            {waiting ? <ChatBubble typing /> : null}
            {sendFailed ? (
              <Alert
                tone="danger"
                title={ASSISTANT_MESSAGE.sendFailed}
                action="Tentar de novo"
                onAction={() => ask(send.variables ?? '')}
              >
                {errorText(send.error)}
              </Alert>
            ) : null}
          </>
        )}
      </ScrollView>

      <View className="bg-surface">
        <View className="flex-row gap-2 px-4 pb-2 pt-2">
          <Icon name="info" color="inkMuted" size={14} />
          <Text className="flex-1 text-caption text-ink-muted">
            {conversation.data?.disclaimer ?? ASSISTANT_DISCLAIMER_FALLBACK}
          </Text>
        </View>
        <ChatComposer
          value={text}
          onChangeText={(value) =>
            setText(value.slice(0, ASSISTANT_MESSAGE_MAX_LENGTH))
          }
          onSend={() => ask(text)}
          disabled={!loaded || waiting}
        />
      </View>
    </KeyboardAvoidingView>
  )
}
