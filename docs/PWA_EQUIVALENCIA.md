# Equivalencia PWA (documento de asignación) y app React Native

El informe de **Sistemas de Información** pide una **Aplicación Web Progresiva (PWA)**: instalable, responsive, disponible 24/7, etc.

Este producto se implementa como **aplicación móvil con Expo / React Native**, con el mismo **backend en Firebase** (Auth, Firestore, Storage) que hubiera soportado una PWA o una web en hosting estático.

## Cómo se mapea el requisito

| Requisito del PDF (PWA) | En este proyecto móvil |
|-------------------------|------------------------|
| Instalable, icono, uso offline limitado (PWA) | **Build** con EAS/Play Store y ícono de la app; caché y datos en cliente como en app nativa |
| Acceso 24/7 vía web | Misma nube (Firebase) alimenta la app; disponibilidad depende de Firebase y red |
| Interfaz adaptable | Layout React Native; pantallas distintas del escritorio, mismo contenido lógico |
| Proveedores de login (Google, Facebook) | Misma Auth de Firebase, flujo OAuth vía `expo-auth-session` y credenciales en consola |
| PayPal | Cloud Functions + URL de aprobación (o flujo de demostración en cliente) |

## Si el profesor exige entregable “web”

- Publicar además con **Expo Web** (`npm run web`) para una vista de navegador, o
- Añadir una **PWA** hermana que consuma el mismo Firestore, o
- Entregar el **enlace a stores** o APK/AAB de pruebas como “producto instalable”.

Conviene dejar constancia en el **informe final** y validar con el criterio del profesor sección 02.
