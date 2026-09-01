export const INTEGRATION_KINDS = [
  "otp",
  "payment",
  "inventory",
  "notifications",
  "wasl",
] as const;

export type IntegrationKind = (typeof INTEGRATION_KINDS)[number];
export type IntegrationStatus = "not_configured" | "testing" | "connected" | "error";

export class UnconfiguredIntegrationError extends Error {
  constructor(kind: IntegrationKind) {
    super(`${kind} integration is not configured`);
    this.name = "UnconfiguredIntegrationError";
  }
}

export interface OtpProvider {
  sendCode(input: { mobile: string; locale: "ar" | "en" }): Promise<{ challengeId: string }>;
  verifyCode(input: { challengeId: string; code: string }): Promise<{ verified: boolean }>;
}

export interface PaymentProvider {
  createPayment(input: {
    bookingReference: string;
    amount: number;
    currency: "SAR";
    callbackUrl: string;
  }): Promise<{ paymentId: string; redirectUrl: string }>;
  refundPayment(input: { paymentId: string; amount?: number }): Promise<{ refundId: string }>;
}

export interface InventoryProvider {
  searchAvailability(input: {
    pickupCity: string;
    returnCity: string;
    pickupAt: string;
    returnAt: string;
  }): Promise<readonly { externalVehicleId: string; dailyRate: number; currency: "SAR" }[]>;
  reserveVehicle(input: {
    externalVehicleId: string;
    bookingReference: string;
  }): Promise<{ reservationId: string }>;
}

export type IntegrationAdapters = {
  otp?: OtpProvider;
  payment?: PaymentProvider;
  inventory?: InventoryProvider;
};

export function requireIntegration<K extends keyof IntegrationAdapters>(
  adapters: IntegrationAdapters,
  kind: K,
): NonNullable<IntegrationAdapters[K]> {
  const adapter = adapters[kind];
  if (!adapter) throw new UnconfiguredIntegrationError(kind);
  return adapter as NonNullable<IntegrationAdapters[K]>;
}
