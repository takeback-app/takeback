import { z } from 'zod'

export const ListAuctionsRequest = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
  search: z.string().trim().max(120).optional(),
})
