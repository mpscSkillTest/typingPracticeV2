import { z } from "zod";

export const newSubscriptionSchema = z.object({
  productId: z.coerce.number().positive().gte(1).lte(4),
  transactionId: z.string(),
  amount: z.coerce.number().positive().gte(90).lte(200),
});
