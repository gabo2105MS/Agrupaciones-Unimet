# Manual de usuario — Agrupaciones Unimet (móvil)

## Descripción

Aplicación móvil para consultar **agrupaciones estudiantiles** de la UNIMET, **afiliarse**, dejar **comentarios (feedback)**, realizar **contribuciones** (PayPal o modo demostración) y, si aplica, **administrar** tipos y grupos.

## Requisitos

- Cuenta de correo para registro o inicio de sesión.
- Conexión a Internet.
- En Android/iOS, permiso de galería si cambias la **foto de perfil** (o la cámara, si la configuras).

## Registro e inicio de sesión (CU-01, CU-02)

1. Al abrir la app, si no hay sesión, verás **Iniciar sesión** y **Crear cuenta**.
2. **Crear cuenta**: nombre, correo y contraseña (mínimo 6 caracteres).
3. Puedes usar **Google** o **Facebook** si el equipo configuró las claves en el proyecto.
4. Tras un registro correcto, accedes a la zona principal (inicio, búsqueda, perfil).

## Perfil (CU-03, CU-03.1)

- Pestaña **Perfil**: ver y editar nombre, teléfono, correo (cambio de correo puede pedir reautenticación según Firebase).
- **Cambiar foto**: sube una imagen; se almacena en Firebase Storage.
- Sección **Agrupaciones a las que perteneces**: toca un ítem para ver el detalle.
- **Historial de contribuciones** lista los aportes registrados.
- **Cerrar sesión** al final de la pantalla.

## Búsqueda (CU-04)

- Pestaña **Buscar**: texto por **nombre** o **identificador (código)**; filtro por **tipo** (chips: “Todos” o un tipo concreto).
- Pulsa **Buscar**; elige un resultado para abrir el **detalle** del grupo.

## Detalle y afiliación (CU-05, CU-05.1)

- Desde inicio o búsqueda, entra a un grupo: misión, visión, participantes, disponibilidad y número de comentarios.
- Si el grupo acepta afiliados y aún no eres miembro, **Proceso de afiliación** abre la pantalla de **Afiliación**; confirma para unirte.
- Si ya eres miembro, verás el mensaje correspondiente y podrás **Dar feedback** o **Contribuir**.

## Feedback (CU-05.1.1)

- Solo **miembros afiliados** al grupo. Escribe el mensaje y envía. Los comentarios se listan en el detalle del grupo y alimentan el contador (ranking por actividad).

## Contribuciones (CU-05.1.2)

- Solo si estás **afiliado** al grupo. Indica monto; la app intenta la **Cloud Function** de PayPal; si no está desplegada, puedes **registrar una contribución de demostración** (etiquetada en el historial).

## Administración (admin)

- Un usuario cuyo correo esté en `EXPO_PUBLIC_ADMIN_EMAILS` (o con rol `admin` en Firestore) verá el tab **Admin**: gestión de **tipos** y **agrupaciones** (alta, edición, baja). **No se puede borrar un grupo con miembros** (requisito no funcional).
- Con `EXPO_PUBLIC_ENABLE_SEED=true`, aparece un botón para **cargar datos de demostración** si aún no hay grupos (solo con rol admin).

## PWA y app móvil

Para el encargo académico (PWA), este cliente es la **aplicación móvil** equivalente; detalle en [PWA_EQUIVALENCIA.md](PWA_EQUIVALENCIA.md).

## Soporte

Problemas técnicos: contactar al equipo vía canales oficiales del curso o del repositorio del proyecto.
