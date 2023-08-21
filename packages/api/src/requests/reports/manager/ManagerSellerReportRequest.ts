import { z } from 'zod'
import { OrderByColumn } from '../../../reports/manager/SellersReport'

export const ManagerSellerReportRequest = z
  .object({
    page: z.string().optional().default('1'),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    cityId: z.string().optional(),
    companyId: z.string().optional(),
    stateId: z.string().optional(),
    orderByColumn: z.nativeEnum(OrderByColumn).optional(),
    order: z.enum(['desc', 'asc']).optional().default('asc'),
    office: z.string().optional(),
    transactionStatus: z.string().optional(),
  })
  .strict()
