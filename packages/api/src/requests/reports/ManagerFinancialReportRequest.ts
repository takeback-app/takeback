import { z } from "zod";
import { OrderByColumn } from "../../reports/CompanyUsersReport";

export const ManagerFinancialReportRequest = z
  .object({
    page: z.string().optional().default("1"),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    transactionStatus: z.string().optional(),
    citiesIds: z.string().array().optional(),
    statesIds: z.string().array().optional(),
    monthlyPaymentStatus: z.string().optional(),
    sort: z.string().optional(),
  })
  .strict();
