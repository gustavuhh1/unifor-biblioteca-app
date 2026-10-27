import { CameraView, useCameraPermissions } from 'expo-camera'
import { useIsFocused, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Icon } from '@/shared/components'
import { DESK_MESSAGE } from '../desk.constants'
import { useScanLookup } from '../hooks/use-scan-lookup'

// A câmera do leitor é sempre escura, nos dois temas (design do leitor, B03):
// por isso as cores do visor são fixas, uma exceção prevista no design system.
const VIEWFINDER_CORNER = 'border-[#7fa6ff]'

// Escanear (B03, RF-BAL-02): lê o QR do pedido com a câmera e abre a ficha do
// aluno (POST /librarian/desk/lookup). Sem câmera ou sem permissão, "Digitar
// matrícula ou código" (B04) faz o mesmo caminho.
export function ScanScreen() {
  const router = useRouter()
  const safe = useSafeAreaInsets()
  const focused = useIsFocused()
  const [permission, requestPermission] = useCameraPermissions()
  const [mountError, setMountError] = useState(false)
  const { onScanned, isLooking, errorMessage } = useScanLookup((record) =>
    router.push({
      pathname: '/identify-student',
      params: { matricula: record.student.matricula },
    }),
  )

  const cameraReady = permission?.granted === true && !mountError

  return (
    <View
      className="flex-1 bg-[#05070d]"
      style={{ paddingTop: safe.top, paddingBottom: safe.bottom + 16 }}
    >
      <StatusBar barStyle="light-content" />
      {cameraReady && focused ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={(result) => onScanned(result.data)}
          onMountError={() => setMountError(true)}
        />
      ) : null}
      <View className="flex-row items-center gap-3 px-4">
        <Pressable
          onPress={() => router.navigate('/')}
          accessibilityRole="button"
          accessibilityLabel="Fechar leitor"
          className="h-[44px] w-[44px] items-center justify-center rounded-pill bg-[#ffffff1a]"
        >
          <Icon name="x" color="onCover" />
        </Pressable>
        <Text className="text-label text-on-cover">Escanear</Text>
      </View>
      <View className="flex-1 items-center justify-center gap-6 px-6">
        {permission === null ? (
          <ActivityIndicator accessibilityLabel="Abrindo a câmera" />
        ) : cameraReady ? (
          <>
            <View className="h-[256px] w-[256px] max-w-full items-center justify-center">
              <View
                className={`absolute left-0 top-0 h-14 w-14 rounded-tl-lg border-l-4 border-t-4 ${VIEWFINDER_CORNER}`}
              />
              <View
                className={`absolute right-0 top-0 h-14 w-14 rounded-tr-lg border-r-4 border-t-4 ${VIEWFINDER_CORNER}`}
              />
              <View
                className={`absolute bottom-0 left-0 h-14 w-14 rounded-bl-lg border-b-4 border-l-4 ${VIEWFINDER_CORNER}`}
              />
              <View
                className={`absolute bottom-0 right-0 h-14 w-14 rounded-br-lg border-b-4 border-r-4 ${VIEWFINDER_CORNER}`}
              />
              {isLooking ? (
                <ActivityIndicator accessibilityLabel="Lendo o QR" />
              ) : null}
            </View>
            <Text className="text-center text-label text-on-cover">
              Aponte para o QR no app do aluno
            </Text>
            <Text className="text-center text-body text-[#a9b4cc]">
              O QR do pedido abre a ficha do aluno. Ali você entrega o pedido e
              registra devoluções.
            </Text>
          </>
        ) : (
          <>
            <Icon name="alert" color="onCover" size={32} />
            <Text className="text-center text-body text-on-cover">
              {mountError
                ? DESK_MESSAGE.cameraUnavailable
                : permission?.canAskAgain
                  ? DESK_MESSAGE.cameraNeeded
                  : DESK_MESSAGE.cameraDenied}
            </Text>
            {mountError ? null : permission?.canAskAgain ? (
              <Button icon="qr" onPress={() => void requestPermission()}>
                Permitir a câmera
              </Button>
            ) : (
              <Button
                variant="secondary"
                onPress={() => void Linking.openSettings()}
              >
                Abrir as configurações
              </Button>
            )}
          </>
        )}
        {errorMessage ? (
          <Text
            accessibilityLiveRegion="polite"
            className="rounded-md bg-[#152549] px-4 py-3 text-center text-body text-on-cover"
          >
            {errorMessage}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={() => router.push('/identify-student')}
        accessibilityRole="button"
        className="mx-4 min-h-12 flex-row items-center justify-center gap-2 rounded-md bg-[#152549] px-4"
      >
        <Icon name="keyboard" color="onCover" />
        <Text className="text-label text-[#a9c1ff]">
          Digitar matrícula ou código
        </Text>
      </Pressable>
    </View>
  )
}
