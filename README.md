# Topaz Banco - Prueba

Aplicación móvil de banca construida con [Expo](https://expo.dev) y React Native. Permite a un cliente:

- **Iniciar sesión** con correo y contraseña.
- **Consultar su saldo disponible** en la pantalla de inicio.
- **Ver sus movimientos** (lista de transferencias realizadas).
- **Realizar transferencias** indicando el valor y el documento del destinatario.

Funciona en Android, iOS y web.

## Tecnologías

| Área | Herramienta |
|---|---|
| Framework | Expo SDK 58, React Native 0.88, React 19 |
| Navegación | Expo Router (rutas basadas en archivos) |
| Estado global | Zustand |
| Peticiones HTTP | Axios |
| Componentes UI | React Native Paper |
| Lenguaje | TypeScript |
| Pruebas | Jest, jest-expo y React Native Testing Library |

## Requisitos

- **Node.js 22.13 o superior** y npm.
- Para correr en un emulador o simulador:
  - [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/) con un emulador, o un dispositivo Android con la app Expo Go.
  - [Xcode](https://docs.expo.dev/workflow/ios-simulator/) (solo macOS) para el simulador de iOS, o un dispositivo con Expo Go.

## Versiones de Android y iOS soportadas

Las versiones mínimas las define Expo SDK 58:

| Plataforma | Versión mínima |
|---|---|
| Android | 7.0 o superior |
| iOS | 16.4 o superior |

Fuente: [documentación de Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/). Para compilar la app para iOS se requiere Xcode 26.4 o superior.

## Instalación y ejecución

1. Clonar el repositorio e instalar las dependencias:

   ```bash
   git clone https://github.com/sergio1999/topaz-frontend-banco.git
   cd topaz-frontend-banco
   npm install
   ```

2. (Opcional) Configurar las URLs de los servicios. Por defecto la app usa las URLs definidas en `src/app/services/base/endpoints.constant.tsx`. Para cambiarlas, crear un archivo `.env` en la raíz:

   ```bash
   EXPO_PUBLIC_API_URL=https://.../default
   EXPO_PUBLIC_BALANCE_API_URL=https://.../default
   EXPO_PUBLIC_TRANSFER_API_URL=https://.../default
   EXPO_PUBLIC_MAKE_TRANSFER_API_URL=https://.../default
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npx expo start
   ```

   Si hay problemas de caché (por ejemplo, tras instalar o desinstalar paquetes), iniciar limpiando la caché:

   ```bash
   npx expo start -c
   ```

4. Abrir la app desde la terminal de Expo:

   - `a`: emulador de Android.
   - `i`: simulador de iOS (solo macOS).
   - `w`: navegador web.
   - O escanear el código QR con la app **Expo Go** en un dispositivo físico.

También se puede arrancar directamente con `npm run android`, `npm run ios` o `npm run web`.

> **Nota sobre web:** los servicios de la API están en AWS API Gateway. Si el navegador bloquea las peticiones por CORS, el backend debe habilitar CORS para el origen de la app. En Android e iOS esto no ocurre.

## Pruebas unitarias

Las pruebas usan Jest con el preset `jest-expo` y React Native Testing Library.

```bash
npm test                      # ejecuta todas las pruebas
npx jest --watch              # modo observador, vuelve a correr al guardar
npx jest --coverage           # reporte de cobertura (carpeta coverage/)
npx jest ruta/al/archivo      # ejecuta un solo archivo de pruebas
```

Cada prueba vive junto al archivo que prueba, dentro de una carpeta `__tests__`:

```
src/app/modules/auth/application/
├── store.tsx
├── useCaseAuth.tsx
└── __tests__/
    ├── store.test.ts
    └── useCaseAuth.test.tsx
```

`metro.config.js` excluye las carpetas `__tests__` del empaquetado para que Expo Router no las tome como rutas. El ayudante `src/test-utils/render.tsx` envuelve los componentes con los proveedores de React Native Paper y de zona segura.

Otros comandos útiles de calidad:

```bash
npx tsc --noEmit    # verificación de tipos
npx expo lint       # análisis estático (la primera vez ofrece configurar ESLint)
```

## Arquitectura

El código está organizado **por módulos de negocio** (`auth`, `home`), y cada módulo se divide en cuatro capas:

```
src/
├── app/                          # Expo Router: cada archivo de rutas es una pantalla
│   ├── _layout.tsx               # Layout raíz: PaperProvider, loader global y guardas de sesión
│   ├── index.tsx                 # Redirige a /home o /auth según la sesión
│   ├── +not-found.tsx            # Pantalla para rutas inexistentes
│   ├── store.tsx                 # Estado global de la app (loader)
│   ├── (pages)/                  # Rutas: solo reexportan las páginas de los módulos
│   │   ├── auth.tsx              #   /auth
│   │   ├── routes.tsx            #   constantes de rutas y su validación
│   │   └── home/                 #   /home y sus rutas hijas
│   │       ├── _layout.tsx       #     HeaderBar + contenido + NavigationBar
│   │       ├── index.tsx         #     /home            (Inicio)
│   │       ├── movements.tsx     #     /home/movements  (Movimientos)
│   │       └── transfers.tsx     #     /home/transfers  (Transferencias)
│   ├── modules/
│   │   ├── auth/ y home/
│   │   │   ├── domain/           # Modelos e interfaces (por ejemplo, ILoginRequest)
│   │   │   ├── application/      # Casos de uso (useCase*) y store de Zustand del módulo
│   │   │   ├── infrastructure/   # Llamadas a la API (apiServices.tsx)
│   │   │   └── presentation/     # components/ y pages/ (UI)
│   └── services/base/
│       ├── endpoints.constant.tsx  # URLs base y endpoints
│       └── http_client.tsx         # Cliente Axios con manejo de errores (ApiError)
├── components/                   # Componentes compartidos Topaz* (basados en React Native Paper)
└── test-utils/                   # Utilidades para las pruebas
```

**Cómo fluye una acción** (por ejemplo, iniciar sesión):

1. `presentation`: el formulario (`formLogin.tsx`) valida los campos y llama al caso de uso.
2. `application`: `useCaseAuth` muestra el loader global, llama al servicio y guarda la sesión en el store.
3. `infrastructure`: `apiServices.tsx` hace la petición con el cliente HTTP base (`httpClient`).
4. `domain`: define los tipos de la petición y la respuesta.

**Navegación y sesión:** las rutas `/home/*` solo son accesibles con sesión iniciada y `/auth` solo sin sesión (`Stack.Protected` en `_layout.tsx`). El grupo `(pages)` no aparece en la URL. Las rutas se declaran en `src/app/(pages)/routes.tsx`.

**Estado:** cada módulo tiene su store de ZustaQnd en `application/store.tsx` (sesión en `auth`; saldo y moneda en `home`), y `src/app/store.tsx` guarda el estado global del loader.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Inicia y abre en Android |
| `npm run ios` | Inicia y abre en iOS |
| `npm run web` | Inicia y abre en el navegador |
| `npm test` | Ejecuta las pruebas unitarias |
| `npm run lint` | Ejecuta el análisis estático |

## Flujo de trabajo con git

Las funcionalidades se desarrollan en ramas `feature/*`, que se integran en `develop`. Los mensajes de commit siguen el formato `Feat - título`, con una descripción más larga en el cuerpo.
