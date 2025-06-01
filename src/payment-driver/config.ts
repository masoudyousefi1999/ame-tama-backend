interface PaymentGatewayConfig {
  merchantId?: string;
  apiKey?: string;
  sandbox: boolean;
}

const paymentGatewayConfigs: Record<string, PaymentGatewayConfig> = {
  zarinpal: {
    merchantId: "zarinpal-merchant",
    sandbox: true,
  },
  zibal: {
    merchantId: "zibal-merchant",
    sandbox: true,
  },
};
export default paymentGatewayConfigs;
