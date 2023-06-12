import { z } from "zod";

export const ManagerSelersReportRequest = z
  .object({
    page: z.string().optional().default("1"),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    office: z.string().optional(),
    citiesIds: z.string().array().optional(),
    statesIds: z.string().array().optional(),
    company: z.string().optional(),
    transactionStatus: z.string().optional(),
    companyStatus: z.string().optional(),
    sort: z.string().optional(),
  })
  .strict();
