import { View } from 'react-native';
import { useTheme } from '@/shared/theme/theme-provider';

// Apenas padrão gráfico. Não contém matrícula nem pedido e NÃO é um QR válido.
const TAMANHO = 25;
function quadrado(x: number, y: number, inicioX: number, inicioY: number) {
  const dx = x - inicioX;
  const dy = y - inicioY;
  if (dx < 0 || dy < 0 || dx >= 7 || dy >= 7) return null;
  return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
}
function marcado(x: number, y: number) {
  for (const [px, py] of [[0, 0], [18, 0], [0, 18]]) {
    const resultado = quadrado(x, y, px, py);
    if (resultado !== null) return resultado;
  }
  return (x * 17 + y * 13 + x * y * 7) % 11 < 5;
}
export default function QrIlustrativo() {
  const { colors } = useTheme();
  return (
    <View accessibilityLabel="QR Code ilustrativo, sem validade para retirada" style={{ width: 210, height: 210, alignSelf: 'center', padding: 9, backgroundColor: colors.qrPaper }}>
      {Array.from({ length: TAMANHO }, (_, y) => (
        <View key={y} style={{ flex: 1, flexDirection: 'row' }}>
          {Array.from({ length: TAMANHO }, (_, x) => (
            <View key={x} style={{ flex: 1, backgroundColor: marcado(x, y) ? colors.qrInk : colors.qrPaper }} />
          ))}
        </View>
      ))}
    </View>
  );
}
