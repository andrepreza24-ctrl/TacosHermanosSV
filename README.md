# TacosHermanosSV - Segundo Desafio Práctico

**Desafío:** Segundo Desafio Práctico  
**Estudiante:** Andre Emanuel Preza Deras
**Carnet:** PD230540

---

## Video de

> **Enlace al video:**

---

## Descripción del Proyecto

Aplicación móvil desarrollada en **React Native** con **Expo** para la gestión de pedidos, catálogo de productos y seguimiento de compras en el restaurante **Tacos Hermanos SV**.

La aplicación cumple con el almacenamiento local persistente mediante `AsyncStorage` y la navegación Stack de `React Navigation`.

---

## Funcionalidades

- **Autenticación Local:** Pantalla de Login con credenciales almacenadas localmente y persistencia de sesión.
- **Menú Principal:** Navegación centralizada hacia las diferentes secciones de la app.
- **Catálogo de Alimentos y Bebidas:**
  - Separación visual por categorías.
  - Más de 10 alimentos y 5 bebidas con imagen, nombre y precio unitario fijo.
  - Selector de cantidad por producto.
- **Pantalla de Orden:**
  - Resumen detallado con subtotal por producto y subtotal general.
  - Cálculo automático del 13% de IVA y total final.
  - Diálogo de confirmación previo al envío de la orden.
- **Historial de Pedidos:**
  - Almacenamiento persistente en `AsyncStorage` bajo la clave `'historialOrdenes'`.
  - Visualización de órdenes confirmadas (ID, fecha/hora, ítems y total).
  - Opción de vaciado/limpieza del historial.

---

## Credenciales de Prueba

| Usuario         | Contraseña | Rol           |
| :-------------- | :--------- | :------------ |
| `tacoshermanos` | `admin`    | Administrador |

---

## Tecnologías Utilizadas

- **Framework:** React Native (Expo SDK)
- **Navegación:** `@react-navigation/native` & `@react-navigation/stack`
- **Persistencia:** `@react-native-async-storage/async-storage`
- **IDE & Entorno:** Visual Studio Code / Android Studio (Emulador Pixel 6a)

---

## Instalación y Ejecución Local

1. **Clonar el repositorio:**

   ```bash
   https://github.com/andrepreza24-ctrl/TacosHermanosSV.git
   ```

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
