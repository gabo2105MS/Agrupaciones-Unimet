# Agrupaciones Unimet

Aplicación móvil (React Native / Expo) para agrupaciones estudiantiles de la UNIMET, con backend en **Firebase** (Auth, Firestore, Storage).

## Requisitos

- Node.js 20 LTS (recomendado)
- Cuenta [Firebase](https://console.firebase.google.com/) (proyecto con Authentication, Firestore y Storage activados)
- Cuenta [Expo](https://expo.dev/) (opcional, para builds en la nube)

## Puesta en marcha

1. Clonar el repositorio e instalar dependencias:

   ```bash
   npm install
   ```

2. Configurar variables de entorno: copia `.env.example` a `.env` y pega la configuración de la app web (o iOS/Android) desde Firebase Console > Configuración del proyecto.

3. Iniciar Metro:

   ```bash
   npm start
   ```

4. Probar en Android, iOS o web según el menú de Expo.

## Estructura (arquitectura por capas)

- `src/config/` — Singleton de Firebase y lectura de `EXPO_PUBLIC_*`
- `src/domain/` — Tipos y reglas de dominio
- `src/repositories/` — Acceso a Firestore / Storage
- `src/services/` — Casos de uso (orquestan repositorios)

## Enlace con GitHub

Repositorio: [Agrupaciones-Unimet](https://github.com/gabo2105MS/Agrupaciones-Unimet)

```bash
git add .
git commit -m "Mensaje"
git push -u origin main
```

(Usa `master` u otra rama si la tienes por defecto.)

## Licencia

Uso académico — proyecto UNIMET.
