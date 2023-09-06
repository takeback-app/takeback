/* eslint-disable no-unused-vars */
import { z } from 'zod'

enum OrderByColumn {
  FULLNAME = 'fullName',
  CREATEDAT = 'createdAt',
}

export const RecognizeSalesRequest = z
  .object({
    dateStart: z.string().optional(),
    dateEnd: z.string().optional(),
    order: z.enum(['desc', 'asc']).optional(),
    orderByColumn: z.nativeEnum(OrderByColumn).optional(),
  })
  .strict()
