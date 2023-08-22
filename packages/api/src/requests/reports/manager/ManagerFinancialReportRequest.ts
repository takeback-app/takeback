import { z } from 'zod'
import { OrderByColumn } from '../../../reports/manager/FinancialReport'

export const ManagerFinancialReportRequest = z
  .object({
    page: z.string().optional().default('1'),
    monthlyPayment: z.string().optional(),
    transactionStatusId: z.string().optional(),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    orderByColumn: z.nativeEnum(OrderByColumn).optional(),
    order: z.enum(['desc', 'asc']).optional().default('asc'),
  })
  .strict()
