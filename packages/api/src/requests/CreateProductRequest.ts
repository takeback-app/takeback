import { z } from 'zod'

export const CreateProductRequest = z
  .object({
    name: z.string(),
    unit: z.string(),
    imageUrl: z.string().url(),
    companyId: z.string(),
    buyPrice: z.number(),
    sellPrice: z.number(),
    defaultPrice: z.number(),
    stock: z.number().int(),
    maxBuyPerConsumer: z.number().int(),
    dateLimit: z.string().datetime(),
    dateLimitWithdrawal: z.string().datetime(),
  })
  .strict()
