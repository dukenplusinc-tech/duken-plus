import { z } from 'zod';

// Define the schema for the subscription payment
export const subscriptionPaymentSchema = z.object({
  id: z.string(), // UUID of the payment record
  shop_id: z.string(), // UUID of the shop associated with the payment
  amount: z.number(), // The amount of the payment
  date: z.string(), // The date the payment was made (ISO 8601 format)
  started_from: z.string().nullable(), // The start date of the subscription (nullable)
  available_until: z.string(), // The date until the subscription is valid (ISO 8601 format)
  transaction_id: z.string(), // The transaction ID for the payment
  payment_method: z.string(), // The method used for payment (e.g., "Kaspi", "Visa")
  note: z.string().nullable(), // Additional notes related to the payment (nullable)

  created_at: z.string().nullable(), // The creation timestamp (nullable)
  updated_at: z.string().nullable(), // The last updated timestamp (nullable)
});

// Infer the TypeScript type from the schema
export type SubscriptionPayment = z.infer<typeof subscriptionPaymentSchema>;

// Define the type for subscription statistics
export interface SubscriptionStats {
  shop_id: string; // The shop's UUID
  active_subscriptions: number; // Count of active subscriptions for the shop
  total_payments: number; // Total amount of all payments made
  total_days_remaining: number; // Total number of days remaining across all active subscriptions
}
