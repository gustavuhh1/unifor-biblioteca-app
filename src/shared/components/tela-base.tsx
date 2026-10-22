import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/theme/theme-provider';
import { Icon } from '@/shared/components/icon';
import { BottomNav } from '@/shared/components/bottom-nav';

type Aba = 'inicio' | 'acervo' | 'emprestimos' | 'assistente' | 'perfil';
const indice: Record<Aba, number> = { inicio: 0, acervo: 1, emprestimos: 2, assistente: 3, perfil: 4 };

interface Props {
  titulo?: string;
  children: ReactNode;
  interna?: boolean;
  rodape?: ReactNode;
  aba?: Aba;
}

// Contêiner visual compartilhado pelas telas do aluno.
// O BottomNav não navega; a equipe conectará as rotas posteriormente.
export default function TelaBase({ titulo, children, interna = false, rodape, aba }: Props) {
  const { colors } = useTheme();
  const safe = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, paddingTop: safe.top }}>
      {titulo ? (
        <View style={{ minHeight: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {interna ? <Icon name="arrowLeft" color="ink" /> : null}
          <Text style={{ color: colors.ink, fontSize: interna ? 19 : 24, fontFamily: 'Figtree_700Bold' }}>{titulo}</Text>
        </View>
      ) : null}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      {rodape ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: Math.max(safe.bottom, 16), backgroundColor: colors.surfaceRaised, borderTopColor: colors.line, borderTopWidth: 1 }}>
          {rodape}
        </View>
      ) : null}
      {aba ? <BottomNav role="aluno" active={indice[aba]} /> : null}
    </View>
  );
}
