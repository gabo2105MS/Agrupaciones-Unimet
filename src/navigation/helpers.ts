import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';

/**
 * Navega a una pantalla del stack padre (tabs → stack de la app).
 */
export function navigateFromTabs(
  tabNav: NavigationProp<ParamListBase>,
  name: keyof AppStackParamList,
  params?: AppStackParamList[typeof name],
): void {
  const parent = tabNav.getParent() as NativeStackNavigationProp<AppStackParamList> | undefined;
  if (!parent) {
    return;
  }
  // Navegación con parámetros variables por ruta; el tipado estricto de `navigate` requiere aserción
  (parent as unknown as { navigate: (n: string, p?: object) => void }).navigate(
    name,
    params as object | undefined,
  );
}
