export type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  monthlyPriceId?: string;
  annualPriceId?: string;
  tokens: number;
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For sole traders building a steady pipeline.",
    monthlyPrice: "$75",
    annualPrice: "$550",
    monthlyPriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
    annualPriceId: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
    tokens: 10,
    features: ["10 lead credits each month", "Unlimited project browsing", "Quotes and secure messaging", "Public business profile"],
  },
  {
    id: "pro",
    name: "Trade Pro",
    description: "For growing teams that want first pick of the best work.",
    monthlyPrice: "$150",
    annualPrice: "$1,000",
    monthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    annualPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    tokens: 25,
    features: ["25 lead credits each month", "Priority lead alerts", "Verified profile tools", "Performance insights", "Priority support"],
    featured: true,
  },
];

export const tokenPack = {
  id: "token-pack",
  name: "20-credit top-up",
  price: "$20",
  tokens: 20,
  priceId: process.env.STRIPE_TOKEN_PACK_PRICE_ID,
};

export function lookupPrice(priceId: string) {
  for (const plan of plans) {
    if (priceId === plan.monthlyPriceId || priceId === plan.annualPriceId) {
      return { kind: "subscription" as const, plan, tokens: plan.tokens };
    }
  }
  if (priceId && priceId === tokenPack.priceId) return { kind: "payment" as const, plan: tokenPack, tokens: tokenPack.tokens };
  return null;
}
