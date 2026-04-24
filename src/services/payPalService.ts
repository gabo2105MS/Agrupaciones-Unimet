import { getFunctions, httpsCallable, type HttpsCallableResult } from 'firebase/functions';
import { getFirebaseApp } from '../config';
import { getFunctionsRegion } from '../config/envExtra';
import type { PayPalOrderResponse } from '../domain/types';

type CreateOrderPayload = { groupId: string; amount: number; currency: string };

/**
 * Crea una orden de PayPal vía Cloud Function (recomendado en producción).
 * Si no hay Functions desplegadas, devuelve null y la UI puede ofrecer flujo simulado.
 */
export async function callCreatePayPalOrder(
  data: CreateOrderPayload,
): Promise<PayPalOrderResponse | null> {
  try {
    const fns = getFunctions(getFirebaseApp(), getFunctionsRegion());
    const create = httpsCallable<CreateOrderPayload, PayPalOrderResponse>(fns, 'createPayPalOrder');
    const res: HttpsCallableResult<PayPalOrderResponse> = await create(data);
    return res.data;
  } catch {
    return null;
  }
}

/**
 * Confirma pago (opcional) cuando el backend lo expone.
 */
export async function callCompletePayPalOrder(data: { orderId: string }): Promise<{ ok: boolean }> {
  try {
    const fns = getFunctions(getFirebaseApp(), getFunctionsRegion());
    const run = httpsCallable(fns, 'completePayPalOrder');
    const res = await run(data);
    return (res.data as { ok: boolean }) ?? { ok: false };
  } catch {
    return { ok: false };
  }
}
