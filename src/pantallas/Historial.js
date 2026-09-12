import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colores, espaciado, tipografia } from '../theme/theme';

export default function Historial({ navigation }) {
  const [ordenes, setOrdenes] = useState([]);

  // Carga las ordenes guardadas cada 
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const datosGuardados = await AsyncStorage.getItem('historialOrdenes');
        if (datosGuardados) {
          setOrdenes(JSON.parse(datosGuardados));
        }
      } catch (e) {
        console.log('Error al cargar historial:', e);
      }
    };

    const unsubscribe = navigation.addListener('focus', cargarHistorial);
    return unsubscribe;
  }, [navigation]);

  // Limpia todo el historial guardado
  const vaciarHistorial = async () => {
    const borrar = async () => {
      try {
        await AsyncStorage.removeItem('historialOrdenes');
        setOrdenes([]);
      } catch (e) {
        console.log('Error al eliminar historial:', e);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que deseas borrar todo el historial de pedidos?')) {
        borrar();
      }
    } else {
      Alert.alert(
        'Borrar Historial',
        '¿Estás seguro de que deseas borrar todo el historial de pedidos?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Borrar', style: 'destructive', onPress: borrar },
        ]
      );
    }
  };

  const renderOrden = ({ item }) => (
    <View style={styles.tarjeta}>
      <View style={styles.encabezadoTarjeta}>
        <Text style={styles.idTexto}>Orden #{item.id}</Text>
        <Text style={styles.fechaTexto}>{item.fecha}</Text>
      </View>
      <View style={styles.linea} />
      <Text style={styles.detalleTexto}>Ítems: {item.totalItems} productos</Text>
      <Text style={styles.montoTexto}>Total: ${item.total ? item.total.toFixed(2) : '0.00'}</Text>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Hitorial</Text>

      {ordenes.length === 0 ? (
        <View style={styles.vacioContenedor}>
          <Text style={styles.vacioTexto}>No tienes órdenes registradas todavía.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={ordenes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderOrden}
            contentContainerStyle={styles.lista}
          />

          <TouchableOpacity style={styles.botonBorrar} onPress={vaciarHistorial} activeOpacity={0.85}>
            <Text style={styles.botonBorrarTexto}>Borrar Historial</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.verde,  
    padding: espaciado.md },
  titulo: {
    ...tipografia.marca,
    fontSize: 20,
    color: colores.crema,
    marginBottom: espaciado.md,
    textAlign: 'center',
  },
  vacioContenedor: { flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' },
  vacioTexto: { color: colores.cremaOpaco, 
    fontSize: 14, 
    textAlign: 'center' },
  lista: { paddingBottom: espaciado.md },
  tarjeta: {
    backgroundColor: colores.verdeClaro,
    padding: espaciado.md,
    marginBottom: espaciado.sm,
    borderRadius: 4,
  },
  encabezadoTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idTexto: { color: colores.crema, 
    fontWeight: '700', fontSize: 15 },
  fechaTexto: { color: colores.cremaOpaco, 
    fontSize: 12 },
  linea: {
    height: 1,
    backgroundColor: colores.verde,
    marginVertical: espaciado.xs,
  },
  detalleTexto: { color: colores.cremaOpaco, 
    fontSize: 13, marginTop: 2 },
  montoTexto: { color: colores.acento, 
    fontWeight: '700', fontSize: 15, 
    marginTop: 4 },
  botonBorrar: {
    backgroundColor: colores.error,
    paddingVertical: espaciado.sm,
    alignItems: 'center',
    marginTop: espaciado.sm,
  },
  botonBorrarTexto: { color: colores.crema, 
    fontWeight: '700', 
    fontSize: 14 },
});