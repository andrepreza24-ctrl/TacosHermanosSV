import { StyleSheet, Text, View } from 'react-native';
import { colores, espaciado, tipografia } from '../theme/theme';

export default function Orden({ route }) {
  // Recibir las cantidades seleccionadas desde el Catalogo
  const cantidades = route.params?.cantidades || {};

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>RESUMEN DE ORDEN</Text>
      
      <View style={styles.tarjetaPrueba}>
        <Text style={styles.subtitulo}>hodsj</Text>
        <Text style={styles.textoAyuda}>
          pruebas de las ordenes del carrito
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.verde,
    padding: espaciado.md,
  },
  titulo: {
    ...tipografia.marca,
    fontSize: 20,
    color: colores.crema,
    marginBottom: espaciado.md,
    textAlign: 'center',
  },
  tarjetaPrueba: {
    backgroundColor: colores.verdeClaro,
    padding: espaciado.lg,
    borderRadius: 4,
    alignItems: 'center',
  },
  subtitulo: {
    color: colores.crema,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: espaciado.xs,
  },
  textoAyuda: {
    color: colores.cremaOpaco,
    fontSize: 13,
    textAlign: 'center',
  },
});