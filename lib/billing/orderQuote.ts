import { getPlanQuoteForCurrency, getPricingPlan, type PricingPlan, type PricingQuote } from "@/lib/billing/plans";

export type ValidatedOrderQuote = {
  plan: PricingPlan;
  quote: PricingQuote;
  notes: Record<string, unknown>;
};

export function readOrderNotes(order: unknown) {
  const notes = order && typeof order === "object" && "notes" in order
    ? (order as { notes?: unknown }).notes
    : null;
  return notes && typeof notes === "object" ? notes as Record<string, unknown> : {};
}

export function getValidatedOrderQuote(order: unknown): ValidatedOrderQuote | null {
  if (!order || typeof order !== "object") return null;
  const entity = order as { amount?: unknown; currency?: unknown; notes?: unknown };
  const notes = readOrderNotes(order);
  const plan = getPricingPlan(readString(notes.planId));
  const currency = readString(entity.currency).toUpperCase();
  const quote = plan ? getPlanQuoteForCurrency(plan, currency) : null;
  const noteAmount = Number(notes.quoteAmount);

  if (!plan || !quote || readString(notes.priceVersion) !== quote.priceVersion) return null;
  if (Number(entity.amount) !== quote.amount || noteAmount !== quote.amount) return null;
  if (readString(notes.quoteCurrency).toUpperCase() !== quote.currency) return null;

  return {plan, quote, notes};
}

export function isPaidRazorpayOrder(order: unknown) {
  return order && typeof order === "object" && (order as { status?: unknown }).status === "paid";
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
