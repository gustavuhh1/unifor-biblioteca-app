
import React from "react";
import {
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/shared/components/icon";

type EscanearQRProps = {
  onFechar?: () => void;
  onDigitarCodigo?: () => void;
};

export default function EscanearQR({
  onFechar,
  onDigitarCodigo,
}: EscanearQRProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* CABEÇALHO */}
      <View
        className="px-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable
          onPress={onFechar}
          accessibilityRole="button"
          accessibilityLabel="Fechar scanner"
          className="min-h-11 flex-row items-center gap-3"
        >
          <View className="h-9 w-9 items-center justify-center rounded-pill bg-[#232733]">
            <Icon name="x" color="onBrand" size={20} />
          </View>

          <Text className="text-label text-white">
            Escanear
          </Text>
        </Pressable>
      </View>

      {/* ÁREA DE CÂMERA */}
      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-[320px] gap-6">
          {/* MOLDURA DE ESCANEAMENTO */}
          <View className="relative h-[260px] w-full">
            {/* CANTO SUPERIOR ESQUERDO */}
            <View className="absolute left-0 top-0 h-9 w-9 rounded-tl-xl border-l-[3px] border-t-[3px] border-[#7FA6FF]" />

            {/* CANTO SUPERIOR DIREITO */}
            <View className="absolute right-0 top-0 h-9 w-9 rounded-tr-xl border-r-[3px] border-t-[3px] border-[#7FA6FF]" />

            {/* CANTO INFERIOR ESQUERDO */}
            <View className="absolute bottom-0 left-0 h-9 w-9 rounded-bl-xl border-b-[3px] border-l-[3px] border-[#7FA6FF]" />

            {/* CANTO INFERIOR DIREITO */}
            <View className="absolute bottom-0 right-0 h-9 w-9 rounded-br-xl border-b-[3px] border-r-[3px] border-[#7FA6FF]" />

            {/* LINHA CENTRAL */}
            <View className="absolute left-5 right-5 top-1/2 h-[2px] bg-[#7FA6FF]" />
          </View>

          {/* INSTRUÇÃO */}
          <View className="items-center gap-2">
            <Text className="text-center text-body text-white">
              Aponte para o QR no app do aluno
            </Text>

            <Text className="text-center text-caption text-[#AAB3C7]">
              O QR do pedido deve ficar dentro da área.
              Lê o código e avança para o registro
              da retirada ou devolução.
            </Text>
          </View>
        </View>
      </View>

      {/* BOTÃO INFERIOR */}
      <View
        className="px-4 pt-4"
        style={{
          paddingBottom: Math.max(insets.bottom, 20),
        }}
      >
        <Pressable
          onPress={onDigitarCodigo}
          accessibilityRole="button"
          className="min-h-12 flex-row items-center justify-center gap-2 rounded-md bg-[#152B62]"
        >
          <Icon
            name="keyboard"
            color="onBrand"
            size={20}
          />

          <Text className="text-label text-white">
            Digitar matrícula ou código
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
