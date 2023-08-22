import { z } from 'zod'
import { OrderByColumn } from '../../../reports/manager/CompanyReport'

export const ManagerCompanyReportRequest = z
  .object({
    page: z.string().optional().default('1'),
    cityId: z.string().optional(),
    stateId: z.string().optional(),
    companyStatusId: z.string().optional(),
    transactionStatusId: z.string().optional(),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    orderByColumn: z.nativeEnum(OrderByColumn).optional(),
    order: z.enum(['desc', 'asc']).optional().default('asc'),
  })
  .strict()
