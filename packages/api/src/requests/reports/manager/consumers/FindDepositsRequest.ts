/* eslint-disable no-unused-vars */
import { z } from 'zod'

export enum FindDepositsOrderByColumn {
  FULL_NAME = 'fullname',
  VALUE = 'value',
  CREATED_AT = 'createdAt',
}

export const FindDepositsRequest = z
  .object({
    page: z.string().optional().default('1'),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    orderByColumn: z.nativeEnum(FindDepositsOrderByColumn).optional(),
    order: z.enum(['desc', 'asc']).optional().default('desc'),
    isPaid: z.string().optional(),
  })
  .strict()
