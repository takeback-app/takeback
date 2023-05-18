import { z } from "zod";

export const CreateCashbackSolicitationRequest = z
  .object({
    companyId: z.string(),
    companyPaymentMethodId: z.number().positive().int().min(1),
    value: z.number().positive().min(0.01),
  })
  .strict();
