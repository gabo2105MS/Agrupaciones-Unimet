export function getFunctionsRegion(): string {
  return process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? 'us-central1';
}

export function isSeedEnabled(): boolean {
  return process.env.EXPO_PUBLIC_ENABLE_SEED === 'true';
}
