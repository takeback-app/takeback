import { boolean, z } from "zod";
import { OrderByColumn } from "../../reports/ManagerCompanyReport";

export const CompanyReportRequest = z
  .object({
    page: z.string().optional().default("1"),
    sort: z.string().optional(),
    statusIds: z.string().array().optional(),
    dataActivateStart: z.string().datetime().optional(),
    dataActivateEnd: z.string().datetime().optional(),
    dataCreatedStart: z.string().datetime().optional(),
    dataCreatedEnd: z.string().datetime().optional(),
    industryIds: z.string().array().optional(),
    citiesIds: z.string().array().optional(),
    statesIds: z.string().array().optional(),
    company: z.string().optional(),
    cashbacksStatusIds: z.string().array().optional(),
  })
  .strict();
