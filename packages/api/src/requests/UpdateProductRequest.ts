import { z } from 'zod'

export const UpdateProductRequest = z
  .object({
    name: z.string(),
    unit: z.string(),
    imageUrl: z.string().url(),
    companyId: z.string().optional(),
    buyPrice: z.number().optional(),
    sellPrice: z.number().optional(),
    defaultPrice: z.number(),
    stock: z.number().int().optional(),
    maxBuyPerConsumer: z.number().int(),
    dateLimit: z.string().datetime(),
    dateLimitWithdrawal: z.string().datetime(),
  })
  .strict()
