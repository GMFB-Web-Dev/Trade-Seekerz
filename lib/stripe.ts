import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured.");
  stripeClient ??= new Stripe(key, {
    appInfo: { name: "Trade Seekerz", version: "1.0.0" },
  });
  return stripeClient;
}

