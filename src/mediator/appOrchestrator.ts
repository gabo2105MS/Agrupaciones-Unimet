import type { NavigationProp, ParamListBase } from '@react-navigation/native';

/**
 * Punto de extensión (Mediator): conectar notificaciones o navegación post-afiliación
 * sin acoplar pantallas entre sí. Por defecto no fuerza otra ruta: el usuario vuelve al detalle.
 */
export function afterAffiliationSuccess(
  _nav: NavigationProp<ParamListBase>,
  _groupId: string,
): void {
  // Ej.: _nav.navigate('Feedback', { groupId: _groupId });
}
