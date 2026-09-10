import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colores, tipografia, espaciado } from '../theme/theme';

export default function Catalogo() {
  return (
    <View style={styles.contenedor}>
      <Text style={tipografia.titulo}>Catálogo</Text>
      <Text style={styles.texto}>
        Aquí van los alimentos y bebidas para armar la orden.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.verde,
    padding: espaciado.lg,
    justifyContent: 'center',
  },
  texto: { color: colores.cremaOpaco, marginTop: espaciado.sm, fontSize: 14, lineHeight: 20 },
});