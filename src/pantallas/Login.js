import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colores, tipografia, espaciado } from '../theme/theme';

// Para los usuarios locales, valida el acceso
const USUARIOS_VALIDOS = [
  { usuario: 'cliente', contrasena: 'tacos123' },
  { usuario: 'admin', contrasena: 'admin123' },
];

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [error, setError] = useState('');

  // Valida credenciales y el ingresar
  const manejarIngreso = async () => {
    if (usuario.trim() === '' || contrasena.trim() === '') {
      setError('Escribe tu usuario y contraseña para continuar.');
      return;
    }

    const coincide = USUARIOS_VALIDOS.find(
      (u) => u.usuario === usuario.trim() && u.contrasena === contrasena
    );

    if (!coincide) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    setError('');

    // Guardar sesion activa en el storage
    try {
      await AsyncStorage.setItem('usuarioActivo', coincide.usuario);
    } catch (e) {
      console.log(e);
    }

    navigation.replace('Menu', { usuario: coincide.usuario });
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.marca}>
          <Text style={styles.marcaTitulo}>TACOS{'\n'}HERMANOS</Text>
          <View style={styles.marcaLinea} />
          <Text style={tipografia.subtituloMarca}>EST. 2021</Text>
        </View>

        <View style={styles.formulario}>
          <Text style={tipografia.etiqueta}>USUARIO</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={(texto) => {
              setUsuario(texto);
              if (error) setError('');
            }}
            placeholder="tu usuario"
            placeholderTextColor={colores.cremaOpaco}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={[tipografia.etiqueta, { marginTop: espaciado.md }]}>CONTRASEÑA</Text>
          <View style={styles.filaContrasena}>
            <TextInput
              style={styles.inputContrasena}
              value={contrasena}
              onChangeText={(texto) => {
                setContrasena(texto);
                if (error) setError('');
              }}
              placeholder="tu contraseña"
              placeholderTextColor={colores.cremaOpaco}
              secureTextEntry={!verContrasena}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
              <Text style={styles.verTexto}>{verContrasena ? 'ocultar' : 'ver'}</Text>
            </TouchableOpacity>
          </View>

          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.boton} onPress={manejarIngreso} activeOpacity={0.85}>
            <Text style={styles.botonTexto}>Ingresar</Text>
          </TouchableOpacity>

          <Text style={styles.ayuda}>Usuario de prueba: cliente / tacos123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.verde },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: espaciado.lg },
  marca: { alignItems: 'center', marginBottom: espaciado.xl * 1.2 },
  marcaTitulo: {
    ...tipografia.marca,
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 36,
  },
  marcaLinea: {
    width: 40,
    height: 2,
    backgroundColor: colores.acento,
    marginVertical: espaciado.sm,
  },
  formulario: { width: '100%' },
  input: {
    borderWidth: 2,
    borderColor: colores.cremaOpaco,
    color: colores.crema,
    fontSize: 16,
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.md,
    marginTop: espaciado.xs,
  },
  filaContrasena: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colores.cremaOpaco,
    marginTop: espaciado.xs,
  },
  inputContrasena: {
    flex: 1,
    color: colores.crema,
    fontSize: 16,
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.md,
  },
  verTexto: {
    color: colores.cremaOpaco,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: espaciado.md,
  },
  error: {
    color: colores.error,
    marginTop: espaciado.md,
    fontSize: 13,
  },
  boton: {
    backgroundColor: colores.acento,
    paddingVertical: espaciado.md,
    alignItems: 'center',
    marginTop: espaciado.lg,
  },
  botonTexto: {
    color: colores.crema,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  ayuda: {
    color: colores.cremaOpaco,
    fontSize: 12,
    textAlign: 'center',
    marginTop: espaciado.md,
  },
});