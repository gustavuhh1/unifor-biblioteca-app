import { useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { AppBar, Button, Icon, TextField, Toggle } from '@/shared/components'

function FieldPair({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return <View className="flex-row gap-3"><View className="min-w-0 flex-1">{left}</View><View className="min-w-0 flex-1">{right}</View></View>
}

export function BookFormScreen() {
  const params = useLocalSearchParams<{ unavailable?: string; isbnError?: string }>()
  const pathname = usePathname()
  const router = useRouter()
  const isEdit = pathname.endsWith('/edit-book')
  const [unavailable, setUnavailable] = useState(params.unavailable === 'true')
  const isbnError = params.isbnError === 'true'
  const title = isEdit ? 'Editar livro' : 'Novo livro'

  return (
    <View className="flex-1 bg-surface">
      <AppBar title={title} subtitle={isEdit ? 'Código Limpo' : 'Cadastro no acervo'} back actions={isEdit ? [{ icon: 'trash', label: 'Remover livro', onPress: () => router.push('/collection-management?remove=1') }] : []} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 px-4 pb-5 pt-2">
        {isEdit ? (
          <View className={`flex-row items-center gap-3 rounded-lg border p-3 ${unavailable ? 'border-warning' : 'border-line'} bg-surface-raised`}>
            <View className="flex-1 gap-1"><Text className="text-label text-ink">Indisponível para novos pedidos</Text><Text className="text-caption text-ink-muted">O livro continua no catálogo, mas ninguém solicita nem entra na fila.</Text></View>
            <Toggle
              value={unavailable}
              onValueChange={setUnavailable}
              label="Indisponível para novos pedidos"
            />
          </View>
        ) : null}
        {unavailable ? (
          <View className="flex-row items-start gap-3 rounded-md bg-warning-soft p-4">
            <Icon name="alert" color="warning" size={20} />
            <View className="flex-1 gap-1"><Text className="text-label text-ink">Livro pausado</Text><Text className="text-body-sm text-ink">Os alunos ainda veem o livro no catálogo, com os botões Solicitar empréstimo e Entrar na fila desativados. Pedidos e filas que já existem não mudam.</Text></View>
          </View>
        ) : null}
        <View className="flex-row items-end gap-2">
          <View className="min-w-0 flex-1"><TextField label="ISBN" icon="barcode" defaultValue={isEdit ? '978-85-7608-267-5' : '9786586057124'} error={isbnError ? 'Não encontrado no Google Books. Preencha os dados abaixo à mão.' : undefined} /></View>
          <Button variant="tonal" icon="globe" onPress={() => router.push('/google-books')}>Buscar</Button>
        </View>
        <TextField label="Título" defaultValue={isEdit ? 'Código Limpo: habilidades práticas do Agile Software' : undefined} placeholder={isEdit ? undefined : 'Preenchido pelo Google Books'} multiline />
        <TextField label="Autores" defaultValue={isEdit ? 'Robert C. Martin' : undefined} placeholder={isEdit ? undefined : 'Preenchido pelo Google Books'} />
        <TextField label="Editora" defaultValue={isEdit ? 'Alta Books' : undefined} placeholder={isEdit ? undefined : 'Preenchido pelo Google Books'} />
        <FieldPair left={<TextField label="Edição" defaultValue={isEdit ? '1ª' : undefined} placeholder="Ex.: 2ª" />} right={<TextField label="Ano" inputMode="numeric" defaultValue={isEdit ? '2011' : undefined} placeholder="Ex.: 2019" />} />
        <Text accessibilityRole="header" className="text-label-lg text-ink">Dados da biblioteca</Text>
        <FieldPair left={<TextField label="CDU" defaultValue={isEdit ? '005.1' : undefined} placeholder="Ex.: 005.1" />} right={<TextField label="Cutter" defaultValue={isEdit ? 'M386c' : undefined} placeholder="Ex.: M386c" />} />
        <FieldPair left={<TextField label="Estante" defaultValue={isEdit ? '2' : undefined} placeholder="Ex.: 2" />} right={<TextField label="Exemplares" inputMode="numeric" defaultValue={isEdit ? '3' : undefined} placeholder="Ex.: 3" />} />
      </ScrollView>
      <View className="border-t border-line bg-surface-raised px-4 pb-4 pt-3">
        <Button block onPress={() => {}}>{isEdit ? 'Salvar alterações' : 'Cadastrar livro'}</Button>
      </View>
    </View>
  )
}
