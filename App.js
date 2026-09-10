import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './src/pantallas/Login';
import Menu from './src/pantallas/Menu';
import Catalogo from './src/pantallas/Catalogo';
import Historial from './src/pantallas/Historial';
import { colores } from './src/theme/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [rutaInicial, setRutaInicial] = useState('Login');

  // Revisa si ya existen sesiones para ir directo al menu
  useEffect(() => {
    const revisarSesion = async () => {
      try {
        const usuarioGuardado = await AsyncStorage.getItem('usuarioActivo');
        if (usuarioGuardado) setRutaInicial('Menu');
      } catch (e) {
        console.log(e);
      } finally {
        setCargando(false);
      }
    };
    revisarSesion();
  }, []);

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color={colores.acento} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={rutaInicial}
        screenOptions={{
          headerStyle: { backgroundColor: colores.verde },
          headerTintColor: colores.crema,
          headerTitleStyle: { fontWeight: '700', letterSpacing: 1, fontSize: 16 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colores.verde },
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{ title: 'MENÚ', headerBackVisible: false }}
        />
        <Stack.Screen name="Catalogo" component={Catalogo} options={{ title: 'CATÁLOGO' }} />
        <Stack.Screen name="Historial" component={Historial} options={{ title: 'HISTORIAL' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    backgroundColor: colores.verde,
    justifyContent: 'center',
    alignItems: 'center',
  },
});