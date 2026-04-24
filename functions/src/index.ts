import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Crea un intent de pago (placeholder).
 * En producción: usa credenciales PayPal desde Secret Manager y la Orders API.
 */
export const createPayPalOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión');
  }
  const { groupId, amount, currency } = data as {
    groupId?: string;
    amount?: number;
    currency?: string;
  };
  if (!groupId || typeof amount !== 'number' || amount <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Parámetros inválidos');
  }
  const orderId = `PAY-${context.auth.uid}-${Date.now()}`;
  return {
    orderId,
    // URL de prueba: reemplázala por la aprobación real del SDK/REST de PayPal
    approvalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=demo-token',
  };
});

/**
 * Completar orden (placeholders para webhooks de PayPal).
 */
export const completePayPalOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión');
  }
  return { ok: true };
});
