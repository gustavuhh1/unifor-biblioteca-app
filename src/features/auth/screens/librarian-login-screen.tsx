import { useRouter } from 'expo-router'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, TextField } from '@/shared/components'

// B19: apresentação visual do acesso do bibliotecário; autenticação fica para a integração.
export function LibrarianLoginScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow justify-center px-5"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View className="items-center gap-3">
          <Image
            source={require('../../../../assets/unifor-biblioteca-mark.png')}
            className="h-[92px] w-[84px]"
            resizeMode="contain"
            accessibilityLabel="Símbolo Unifor Biblioteca"
          />
          <Text className="text-center text-hero text-ink">
            Unifor Biblioteca
          </Text>
          <Text className="px-1 text-center text-body text-ink-muted">
            Acesso do bibliotecário. Entre com a matrícula e a senha
            pré-cadastradas pela biblioteca.
          </Text>
        </View>

        <View className="mt-10 gap-5">
          <TextField
            label="Matrícula"
            icon="user"
            inputMode="numeric"
            keyboardType="number-pad"
            maxLength={7}
            defaultValue="1800123"
            hint="7 dígitos."
          />
          <View className="gap-2">
            <TextField
              label="Senha"
              icon="lock"
              type="password"
              defaultValue="biblioteca"
            />
            <Pressable
              accessibilityRole="button"
              className="min-h-10 self-end justify-center px-1"
            >
              <Text className="text-label-sm text-brand">
                Esqueci minha senha
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-24 gap-2">
          <Button block>Entrar</Button>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/')}
            className="min-h-10 items-center justify-center"
          >
            <Text className="text-label-sm text-brand">Acessar como aluno</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}
