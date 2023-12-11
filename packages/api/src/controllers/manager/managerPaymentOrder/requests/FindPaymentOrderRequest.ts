/* eslint-disable no-unused-vars */
import { z } from 'zod'

export enum OrderByColumn {
  completar = 'completar',
}

export const FindPaymentOrderRequest = z
  .object({
    page: z.string().optional().default('1'),
    limit: z.string().optional(),
    statusId: z.string().optional(),
    paymentMethodId: z.string().optional(),
    companyId: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
  .strict()

export type FindPaymentOrderProps = z.infer<typeof FindPaymentOrderRequest>
