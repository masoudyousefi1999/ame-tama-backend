/**
 * Shaparak (Iran Payment Gateway) Fee Calculator
 * Based on standard Shaparak fee structure
 */

export interface ShaparakFeeConfig {
  // Base fee percentages
  baseFeePercentage: number; // Usually 0.5% to 1%
  minimumFee: number; // Minimum fee in Rials
  maximumFee: number; // Maximum fee in Rials

  // Additional fees
  transactionFee: number; // Fixed transaction fee
  gatewayFee: number; // Gateway processing fee

  // VAT (Value Added Tax) - usually 9% in Iran
  vatPercentage: number;
}

// Default Shaparak fee configuration
export const DEFAULT_SHAPARAK_CONFIG: ShaparakFeeConfig = {
  baseFeePercentage: 0.8, // 0.8% base fee
  minimumFee: 1000, // 1,000 Rials minimum
  maximumFee: 50000, // 50,000 Rials maximum
  transactionFee: 500, // 500 Rials transaction fee
  gatewayFee: 200, // 200 Rials gateway fee
  vatPercentage: 9, // 9% VAT
};

export interface FeeCalculationResult {
  baseAmount: number; // Original amount
  baseFee: number; // Base fee (percentage)
  transactionFee: number; // Fixed transaction fee
  gatewayFee: number; // Gateway processing fee
  subtotalFees: number; // Sum of all fees before VAT
  vatAmount: number; // VAT on fees
  totalFees: number; // Total fees including VAT
  finalAmount: number; // Amount customer pays
  breakdown: {
    item: string;
    amount: number;
    description: string;
  }[];
}

/**
 * Calculate Shaparak fees for a given amount
 */
export function calculateShaparakFees(
  amount: number,
  config: ShaparakFeeConfig = DEFAULT_SHAPARAK_CONFIG,
): FeeCalculationResult {
  // Calculate base fee (percentage of amount)
  let baseFee = (amount * config.baseFeePercentage) / 100;

  // Apply minimum and maximum limits
  baseFee = Math.max(config.minimumFee, Math.min(baseFee, config.maximumFee));

  // Calculate subtotal of all fees
  const subtotalFees = baseFee + config.transactionFee + config.gatewayFee;

  // Calculate VAT on fees
  const vatAmount = (subtotalFees * config.vatPercentage) / 100;

  // Calculate total fees
  const totalFees = subtotalFees + vatAmount;

  // Calculate final amount customer pays
  const finalAmount = amount + totalFees;

  // Create breakdown for transparency
  const breakdown = [
    {
      item: 'مبلغ اصلی',
      amount: amount,
      description: 'مبلغ سفارش شما',
    },
    {
      item: 'کارمزد پایه',
      amount: baseFee,
      description: `${config.baseFeePercentage}% از مبلغ اصلی`,
    },
    {
      item: 'کارمزد تراکنش',
      amount: config.transactionFee,
      description: 'کارمزد ثابت تراکنش',
    },
    {
      item: 'کارمزد درگاه',
      amount: config.gatewayFee,
      description: 'کارمزد پردازش درگاه',
    },
    {
      item: 'مالیات بر ارزش افزوده',
      amount: vatAmount,
      description: `${config.vatPercentage}% از مجموع کارمزدها`,
    },
  ];

  return {
    baseAmount: amount,
    baseFee,
    transactionFee: config.transactionFee,
    gatewayFee: config.gatewayFee,
    subtotalFees,
    vatAmount,
    totalFees,
    finalAmount,
    breakdown,
  };
}
