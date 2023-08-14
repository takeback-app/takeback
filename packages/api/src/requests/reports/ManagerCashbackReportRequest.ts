import { z } from 'zod'
import { OrderByColumn } from '../../reports/manager/CashbacksReport'

export const ManagerCashbackReportRequest = z
  .object({
    page: z.string().optional().default('1'),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    cityId: z.string().optional(),
    companyId: z.string().optional(),
    companyStatusId: z.string().optional(),
    companyUserId: z.string().optional(),
    stateId: z.string().optional(),
    transactionStatusId: z.string().optional(),
    paymentMethodId: z.string().optional(),
    orderByColumn: z.nativeEnum(OrderByColumn).optional(),
    order: z.enum(['desc', 'asc']).optional().default('desc'),
  })
  .strict()
