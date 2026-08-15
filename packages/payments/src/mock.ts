import type { PaymentProvider, PaymentRequest, VerifiedPayment } from "./provider.ts";
export class MockPaymentProvider implements PaymentProvider {
  private connected = new Set<string>();
  async connectCreator(id: string) { this.connected.add(id); }
  async disconnectCreator(id: string) { this.connected.delete(id); }
  async getConnectionStatus(id: string) { return this.connected.has(id) ? "connected" as const : "disconnected" as const; }
  async createPayment(r: PaymentRequest) { return { checkoutUrl: "mock://checkout", reference: `mock_${crypto.randomUUID()}` }; }
  async verifyPayment(raw: string) { return JSON.parse(raw) as VerifiedPayment; }
  async handleWebhook(raw: string, headers: Record<string,string>) { if (headers["x-mock-signature"] !== "local-demo") return null; return this.verifyPayment(raw, headers); }
  getSupportedPaymentMethods() { return ["mock-upi", "mock-card"]; }
  getSupportedCurrencies() { return ["INR", "USD", "EUR"]; }
  getCapabilities() { return { hostedCheckout: true, webhooks: true, creatorOAuth: false, realMoney: false }; }
}
