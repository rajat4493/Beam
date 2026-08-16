export type PaymentRequest = { creatorId: string; streamId?: string; amountMinor: number; currency: string; supporterName: string; message: string };
export type VerifiedPayment = PaymentRequest & { providerEventId: string; paidAt: number };
export interface PaymentProvider {
  connectCreator(creatorId: string): Promise<void>;
  disconnectCreator(creatorId: string): Promise<void>;
  getConnectionStatus(creatorId: string): Promise<"connected" | "disconnected">;
  createPayment(request: PaymentRequest): Promise<{ checkoutUrl: string; reference: string }>;
  verifyPayment(raw: string, headers: Record<string, string>): Promise<VerifiedPayment | null>;
  handleWebhook(raw: string, headers: Record<string, string>): Promise<VerifiedPayment | null>;
  getSupportedPaymentMethods(): string[];
  getSupportedCurrencies(): string[];
  getCapabilities(): Record<string, boolean>;
}
