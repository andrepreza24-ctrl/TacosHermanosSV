import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRODUCTOS } from '../datos/productos';
import { colores, espaciado } from '../theme/theme';

export default function Catalogo({ navigation }) {
  const [categoriaActiva, setCategoriaActiva] = useState('alimentos');
  const [cantidades, setCantidades] = useState({});
  const [mensajeError, setMensajeError] = useState('');

  // Con esto cargo el carrito previo del AsyncStorage al abrir esta pantalla de ver mi 
  // orden
  useEffect(() => {
    const cargarCarritoPrevio = async () => {
      try {
        const carritoGuardado = await AsyncStorage.getItem('carritoTemporal');
        if (carritoGuardado) {
          setCantidades(JSON.parse(carritoGuardado));
        }
      } catch (e) {
        console.log('Error al cargar carrito temporal:', e);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      cargarCarritoPrevio();
    });

    return unsubscribe;
  }, [navigation]);

  // Guarda las cantidades en el AsyncStorage
  const guardarCarrito = async (nuevasCantidades) => {
    try {
      await AsyncStorage.setItem('carritoTemporal', JSON.stringify(nuevasCantidades));
    } catch (e) {
      console.log('Error al guardar carrito temporal:', e);
    }
  };

  // Incrementa y decrementar las cantidades del producto
  const modificarCantidad = (id, cambio) => {
    const actual = cantidades[id] || 0;
    const nueva = actual + cambio;

    if (nueva < 0) return;

    if (nueva > 20) {
      setMensajeError('El máximo permitido por producto es de 20 unidades.');
      return;
    }

    setMensajeError('');
    const actualizadas = { ...cantidades, [id]: nueva };
    setCantidades(actualizadas);
    guardarCarrito(actualizadas);
  };

  const productosFiltrados = PRODUCTOS.filter(
    (p) => p.categoria === categoriaActiva
  );

  const totalUnidades = Object.values(cantidades).reduce(
    (acc, cant) => acc + cant,
    0
  );

  const irAOrden = () => {
    if (totalUnidades === 0) {
      setMensajeError('Debes seleccionar al menos 1 producto para continuar.');
      return;
    }
    setMensajeError('');
    navigation.navigate('Orden', { cantidades });
  };

  const renderItem = ({ item }) => {
    const cantidad = cantidades[item.id] || 0;

    return (
      <View style={styles.tarjeta}>
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
        <View style={styles.info}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.precio}>${item.precio.toFixed(2)}</Text>

          <View style={styles.selector}>
            <TouchableOpacity
              style={styles.botonControl}
              onPress={() => modificarCantidad(item.id, -1)}
            >
              <Text style={styles.textoControl}>-</Text>
            </TouchableOpacity>

            <Text style={styles.cantidadTexto}>{cantidad}</Text>

            <TouchableOpacity
              style={styles.botonControl}
              onPress={() => modificarCantidad(item.id, 1)}
            >
              <Text style={styles.textoControl}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.contenedorTabs}>
        <TouchableOpacity
          style={[styles.tab, categoriaActiva === 'alimentos' && styles.tabActiva]}
          onPress={() => setCategoriaActiva('alimentos')}
        >
          <Text style={[styles.tabTexto, categoriaActiva === 'alimentos' && styles.tabTextoActivo]}>
            Platos fuertes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, categoriaActiva === 'bebidas' && styles.tabActiva]}
          onPress={() => setCategoriaActiva('bebidas')}
        >
          <Text style={[styles.tabTexto, categoriaActiva === 'bebidas' && styles.tabTextoActivo]}>
            Bebidas
          </Text>
        </TouchableOpacity>
      </View>

      {mensajeError !== '' && (
        <Text style={styles.errorText}>{mensajeError}</Text>
      )}

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
      />

      <TouchableOpacity style={styles.botonVerOrden} onPress={irAOrden} activeOpacity={0.85}>
        <Text style={styles.botonVerOrdenTexto}>
          Ver Mi Orden ({totalUnidades})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { 
    flex: 1, 
    backgroundColor: colores.verde, 
    padding: espaciado.md },
  contenedorTabs: {
    flexDirection: 'row',
    marginBottom: espaciado.md,
    backgroundColor: colores.verdeClaro,
  },
  tab: { flex: 1, 
    paddingVertical: espaciado.sm, 
    alignItems: 'center' },
  tabActiva: { backgroundColor: colores.acento },
  tabTexto: { color: colores.cremaOpaco, 
    fontWeight: '600' },
  tabTextoActivo: { color: colores.crema, 
    fontWeight: '700' },
  errorText: {
    color: colores.error,
    backgroundColor: 'rgba(201, 133, 97, 0.15)',
    padding: espaciado.sm,
    marginBottom: espaciado.sm,
    textAlign: 'center',
    fontSize: 13,
  },
  lista: { paddingBottom: espaciado.xl },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: colores.verdeClaro,
    marginBottom: espaciado.sm,
    padding: espaciado.sm,
    alignItems: 'center',
  },
  imagen: { width: 70, 
    height: 70, 
    borderRadius: 4 },
  info: { flex: 1, 
    marginLeft: espaciado.md },
  nombre: { color: colores.crema, 
    fontSize: 15, 
    fontWeight: '600' },
  precio: { color: colores.cremaOpaco, 
    fontSize: 14, 
    marginTop: 2 },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: espaciado.xs,
  },
  botonControl: {
    backgroundColor: colores.verde,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoControl: { color: colores.crema, 
    fontSize: 16, 
    fontWeight: '700' },
  cantidadTexto: {
    color: colores.crema,
    paddingHorizontal: espaciado.md,
    fontWeight: '700',
  },
  botonVerOrden: {
    backgroundColor: colores.acento,
    paddingVertical: espaciado.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  botonVerOrdenTexto: {
    color: colores.crema,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
});