import { getAffiliation } from '../repositories/affiliationRepository';
import { addContribution, listContributionsByUser } from '../repositories/contributionRepository';
import { callCreatePayPalOrder } from './payPalService';
import * as WebBrowser from 'expo-web-browser';
import type { WebBrowserAuthSessionResult } from 'expo-web-browser';
import type { PayPalOrderResponse } from '../domain/types';

export async function recordSimulatedContribution(
  userId: string,
  groupId: string,
  amount: number,
  currency: string = 'USD',
): Promise<string> {
  const aff = await getAffiliation(userId, groupId);
  if (!aff) {
    throw new Error('Debes estar afiliado al grupo para contribuir');
  }
  return addContribution({
    userId,
    groupId,
    amount,
    currency,
    status: 'simulated',
  });
}

export async function startPayPalContribution(
  userId: string,
  groupId: string,
  amount: number,
  currency: string = 'USD',
): Promise<PayPalOrderResponse | { simulated: true }> {
  const aff = await getAffiliation(userId, groupId);
  if (!aff) {
    throw new Error('Debes estar afiliado al grupo para contribuir');
  }
  const order = await callCreatePayPalOrder({ groupId, amount, currency });
  if (order?.approvalUrl) {
    return order;
  }
  return { simulated: true };
}

export async function openPayPalApproval(approvalUrl: string): Promise<WebBrowserAuthSessionResult> {
  return WebBrowser.openAuthSessionAsync(approvalUrl, undefined);
}

export { listContributionsByUser };
