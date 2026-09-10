import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colores, tipografia, espaciado } from '../theme/theme';

const OPCIONES = [
  {
    id: 'Catalogo',
    titulo: 'Catálogo',
    descripcion: 'Elige tus alimentos y bebidas',
    color: colores.acento,
  },
  {
    id: 'Orden',
    titulo: 'Mi orden',
    descripcion: 'Revisa el detalle y el total',
    color: '#4A7C63',
  },
  {
    id: 'Historial',
    titulo: 'Historial',
    descripcion: 'Tus órdenes ya confirmadas',
    color: '#8A6A3F',
  },
];

export default function Menu({ route, navigation }) {
  const [usuario, setUsuario] = useState(route.params?.usuario ?? '');

  // Recupera el usuario del storage si es que no viene de params
  useEffect(() => {
    const cargarUsuario = async () => {
      if (!usuario) {
        const guardado = await AsyncStorage.getItem('usuarioActivo');
        if (guardado) setUsuario(guardado);
      }
    };
    cargarUsuario();
  }, []);

  // Borra la sesion y regresar al login
  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('usuarioActivo');
    navigation.replace('Login');
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={tipografia.etiqueta}>HOLA</Text>
        <Text style={styles.saludo}>{usuario || 'invitado'}</Text>
      </View>

      <View style={styles.lista}>
        {OPCIONES.map((op) => (
          <TouchableOpacity
            key={op.id}
            style={[styles.tarjeta, { borderLeftColor: op.color }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(op.id)}
          >
            <Text style={styles.tarjetaTitulo}>{op.titulo}</Text>
            <Text style={styles.tarjetaDescripcion}>{op.descripcion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.salir} onPress={cerrarSesion}>
        <Text style={styles.salirTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.verde, padding: espaciado.lg },
  encabezado: { marginTop: espaciado.lg, marginBottom: espaciado.xl },
  saludo: {
    ...tipografia.marca,
    fontSize: 26,
    letterSpacing: 1,
    textTransform: 'capitalize',
  },
  lista: { gap: espaciado.md },
  tarjeta: {
    backgroundColor: colores.verdeClaro,
    borderLeftWidth: 4,
    padding: espaciado.md,
  },
  tarjetaTitulo: { ...tipografia.titulo, fontSize: 17 },
  tarjetaDescripcion: {
    color: colores.cremaOpaco,
    fontSize: 13,
    marginTop: 2,
  },
  salir: {
    marginTop: 'auto',
    paddingVertical: espaciado.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colores.verdeClaro,
  },
  salirTexto: {
    color: colores.cremaOpaco,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});