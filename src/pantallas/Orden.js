import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRODUCTOS } from '../datos/productos';
import { colores, espaciado, tipografia } from '../theme/theme';

export default function Orden({ route, navigation }) {
  // Recibe los productos 
  const [cantidades, setCantidades] = useState(route.params?.cantidades || {});

  // Para cargar el estado actual del carrito guardado en el AsyncStorage al abrir la pantalla
  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        const carritoGuardado = await AsyncStorage.getItem('carritoTemporal');
        if (carritoGuardado) {
          setCantidades(JSON.parse(carritoGuardado));
        }
      } catch (e) {
        console.log('Error al cargar carrito en Orden:', e);
      }
    };

    cargarCarrito();
  }, []);

  // Filtra solo productos con cantidad que sean mayores a 0
  const itemsSeleccionados = PRODUCTOS.filter(
    (producto) => (cantidades[producto.id] || 0) > 0
  ).map((producto) => ({
    ...producto,
    cantidad: cantidades[producto.id],
    subtotalItem: producto.precio * cantidades[producto.id],
  }));

  const subtotal = itemsSeleccionados.reduce(
    (acc, item) => acc + item.subtotalItem,
    0
  );
  const iva = subtotal * 0.13;
  const total = subtotal + iva;
  const totalItems = itemsSeleccionados.reduce((acc, item) => acc + item.cantidad, 0);

  // Guarda el pedido en AsyncStorage y finalizar
  const guardarYFinalizar = async () => {
    try {
      const nuevaOrden = {
        id: Date.now().toString().slice(-6),
        fecha: new Date().toLocaleString('es-SV', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
        totalItems,
        subtotal,
        iva,
        total,
      };

      // Leer historial actual de AsyncStorage
      const historialPrevio = await AsyncStorage.getItem('historialOrdenes');
      const ordenesActuales = historialPrevio ? JSON.parse(historialPrevio) : [];

      // Agregar la nueva orden al inicio
      const nuevoHistorial = [nuevaOrden, ...ordenesActuales];
      await AsyncStorage.setItem('historialOrdenes', JSON.stringify(nuevoHistorial));

      // Limpiar el carrito temporal una vez completada la compra
      await AsyncStorage.removeItem('carritoTemporal');

      // Redirigir al Menu Principal
      navigation.navigate('Menu');
    } catch (e) {
      console.log('Error al guardar la orden:', e);
    }
  };

  // Alerta de confirmacion de la orden
  const procesarConfirmacion = () => {
    if (itemsSeleccionados.length === 0) return;

    if (Platform.OS === 'web') {
      const resp = window.confirm(`¿Confirmar pedido por un total de $${total.toFixed(2)}?`);
      if (resp) guardarYFinalizar();
    } else {
      Alert.alert(
        'Confirmar Pedido',
        `¿Desea procesar su compra por un total de $${total.toFixed(2)}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: guardarYFinalizar },
        ]
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tarjetaItem}>
      <Image source={{ uri: item.imagen }} style={styles.imagenItem} />
      <View style={styles.infoItem}>
        <Text style={styles.nombreItem}>{item.nombre}</Text>
        <Text style={styles.detallePrecio}>
          {item.cantidad} x ${item.precio.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.montoSubtotal}>${item.subtotalItem.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Resumen</Text>

      {itemsSeleccionados.length === 0 ? (
        <View style={styles.vacioContenedor}>
          <Text style={styles.vacioTexto}>No has seleccionado ningún producto.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={itemsSeleccionados}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.lista}
          />

          <View style={styles.bloqueTotales}>
            <View style={styles.filaMonto}>
              <Text style={styles.etiquetaMonto}>Subtotal:</Text>
              <Text style={styles.valorMonto}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.filaMonto}>
              <Text style={styles.etiquetaMonto}>IVA (13%):</Text>
              <Text style={styles.valorMonto}>${iva.toFixed(2)}</Text>
            </View>

            <View style={styles.lineaDivisora} />

            <View style={styles.filaMonto}>
              <Text style={styles.etiquetaTotal}>TOTAL A PAGAR:</Text>
              <Text style={styles.valorTotal}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.botonConfirmar}
              onPress={procesarConfirmacion}
              activeOpacity={0.85}
            >
              <Text style={styles.botonConfirmarTexto}>Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, 
    backgroundColor: colores.verde, 
    padding: espaciado.md },
  titulo: {
    ...tipografia.marca,
    fontSize: 20,
    color: colores.crema,
    marginBottom: espaciado.md,
    textAlign: 'center',
  },
  vacioContenedor: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' },
  vacioTexto: { 
    color: colores.cremaOpaco, 
    fontSize: 14, 
    textAlign: 'center' },
  lista: { 
    paddingBottom: espaciado.md },
  tarjetaItem: {
    flexDirection: 'row',
    backgroundColor: colores.verdeClaro,
    padding: espaciado.sm,
    marginBottom: espaciado.xs,
    alignItems: 'center',
  },
  imagenItem: { 
    width: 50, 
    height: 50, 
    borderRadius: 4 },
  infoItem: { 
    flex: 1, 
    marginLeft: 
    espaciado.sm },
  nombreItem: { 
    color: colores.crema, 
    fontWeight: '600', 
    fontSize: 14 },
  detallePrecio: { 
    color: colores.cremaOpaco, 
    fontSize: 12, 
    marginTop: 2 },
  montoSubtotal: { 
    color: colores.crema, 
    fontWeight: '700', 
    fontSize: 14 },
  bloqueTotales: {
    backgroundColor: colores.verdeClaro,
    padding: espaciado.md,
    marginTop: 'auto',
  },
  filaMonto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: espaciado.xs,
  },
  etiquetaMonto: { 
    color: colores.cremaOpaco, 
    fontSize: 14 },
  valorMonto: { color: colores.crema, 
    fontSize: 14, 
    fontWeight: '600' },
  lineaDivisora: {
    height: 1,
    backgroundColor: colores.verde,
    marginVertical: espaciado.xs,
  },
  etiquetaTotal: { 
    color: colores.crema, 
    fontSize: 16, 
    fontWeight: '700' },
  valorTotal: { 
    color: colores.acento, 
    fontSize: 18, fontWeight: '700' },
  botonConfirmar: {
    backgroundColor: colores.acento,
    paddingVertical: espaciado.md,
    alignItems: 'center',
    marginTop: espaciado.md,
  },
  botonConfirmarTexto: {
    color: colores.crema,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
});