# Agrupaciones Unimet

App móvil (**Expo / React Native**) para agrupaciones estudiantiles UNIMET: autenticación (email, Google, Facebook), perfiles, búsqueda, afiliación, feedback, contribuciones (PayPal vía Cloud Functions o modo demo), panel **admin** (tipos y grupos), con **Firebase** (Auth, Firestore, Storage).

Repositorio: [https://github.com/gabo2105MS/Agrupaciones-Unimet](https://github.com/gabo2105MS/Agrupaciones-Unimet)

## Requisitos

- Node.js 20+ (recomendado LTS)
- Cuenta [Firebase](https://console.firebase.google.com/): proyecto con **Authentication** (Email, Google, Facebook según uses), **Firestore**, **Storage**
- [Firebase CLI](https://firebase.google.com/docs/cli) para desplegar reglas y Functions (opcional)

## Configuración

1. `npm install`
2. Copiar [`.env.example`](.env.example) a `.env` y completar `EXPO_PUBLIC_FIREBASE_*`.
3. OAuth:
   - **Google**: IDs de cliente en Google Cloud vinculados a Firebase Auth; `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` obligatorio para el flujo en la app.
   - **Facebook**: app en Meta, `EXPO_PUBLIC_FACEBOOK_APP_ID`.
4. **Admins**: lista en `EXPO_PUBLIC_ADMIN_EMAILS` (emails separados por coma o espacio).
5. Despliegue de reglas e índices (desde la raíz del repo):

   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

6. **Cloud Functions** (PayPal de producción): `cd functions && npm install && npm run build`, luego `firebase deploy --only functions` (proyecto enlazado con `firebase login` y `firebase use`).

## Scripts

| Comando | Descripción |
|---------|---------------|
| `npm start` | Metro / Expo |
| `npm run android` / `ios` / `web` | Plataforma |
| `npm test` | Jest (casos alineados al plan de pruebas del curso) |

## Documentación

- [Manual de usuario (móvil)](docs/MANUAL_USUARIO.md)
- [Equivalencia PWA / entrega académica](docs/PWA_EQUIVALENCIA.md)

## Estructura

- `src/config` — Firebase (singleton)
- `src/repositories` — Firestore / Storage
- `src/services` — Casos de uso
- `src/screens` — UI
- `src/navigation` — React Navigation
- `src/mediator` — Orquestación ligera (extensible)
- `functions` — callable `createPayPalOrder` (placeholder; integrar PayPal real con secretos)

## Licencia

Uso académico — UNIMET.
